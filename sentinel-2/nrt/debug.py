import json
from copy import deepcopy

import esprima
from sentinelhub import (
    DownloadFailedException
)


def replace_function(evalscript, function_name, to_replace):
    """
    Replaces a function definition in javascript with a different string
    """
    ast = esprima.parse(evalscript, {'range': True})

    class MyVisitor(esprima.NodeVisitor):
        """Custom node visitor that focuses on one particular function call"""
        def __init__(self):
            self.found_ranges = []

        # we only care for FunctionDecleration nodes
        def visit_FunctionDeclaration(self, node):
            if (node.id.name == function_name):
                self.found_ranges.append(node.range)

            # visit everything else in the tree
            self.generic_visit(node)

    # parse wth range info, we need that later
    ast = esprima.parse(evalscript, {'range': True})

    # visit the AST, this fills the found_ranges list
    v = MyVisitor()
    v.visit(ast)

    # we need to go through the source code from behind
    # since making any changes will mess up our ranges
    replaced = evalscript
    for start, end in reversed(v.found_ranges):
        code_before = evalscript[:start]
        code_after = evalscript[end:]
        replaced = code_before + to_replace + code_after
    return replaced


def get_mosaicking(evalscript):
    ast = esprima.parse(evalscript)

    # Depending on the mosaicking, get other (somehow) hidden objects
    class MyVisitor(esprima.NodeVisitor):
        """Custom node visitor that focuses on one particular function call"""
        def __init__(self):
            self.mosaicking = "SIMPLE"

        # we only care for FunctionDecleration nodes
        def visit_Property(self, node):
            if (node.key.name == "mosaicking"):
                self.mosaicking = node.value.value

    v = MyVisitor()
    v.visit(ast)
    return v.mosaicking


def get_sample_scene(sh_request):
    """
    Locally saves input to evaluatePixel for debugging.

    Args:
        sh_request: A Sentinelhub request
    Returns:
        (sample, scene): Intercepted sample and scene objects
            passed to evaluatePixel()
    """
    sh_request = deepcopy(sh_request)
    evalscript = sh_request.payload["evalscript"]

    # Get mosaicking strategy from evalscript

    mosaicking = get_mosaicking(evalscript)

    if mosaicking == "SIMPLE":
        prop_name = ""
    elif mosaicking == "TILE":
        prop_name = ".tiles"
        # TODO CHECK IF TILE WORKS!
    elif mosaicking == "ORBIT":
        prop_name = ".orbits"
    
    get_values = f"""
        function evaluatePixel(sample, scenes) {{
            throw new Error("SEPARATE" + JSON.stringify(sample) + "SEPARATE" + JSON.stringify(scenes{prop_name}) + "SEPARATE");
            return sample
        }}
    """

    # Replace evaluate pixel function with own debug function

    sh_request.payload["evalscript"] = replace_function(
        evalscript,
        "evaluatePixel",
        get_values)

    # Intercept and get sample and scene
    try:
        sh_request.get_data()
    except DownloadFailedException as e:
        cleaned = e.args[0].replace("\\", "").split("SEPARATE")
        sample = cleaned[1]
        if mosaicking == "ORBIT":
            return sample, "{orbits: "+cleaned[2]+"}"
        elif mosaicking == "TILE":
            return sample, "{tiles: "+cleaned[2]+"}"
    return sample, cleaned[2]


def get_collections(sh_request):
    """
    Locally saves input to evaluatePixel for debugging.

    Args:
        sh_request: A Sentinelhub request
    Returns:
        (collections): Intercepted collections object
            passed to preProcessScenes()
    """
    sh_request = deepcopy(sh_request)
    evalscript = sh_request.payload["evalscript"]

    mosaicking = get_mosaicking(evalscript)

    if mosaicking == "SIMPLE":
        ValueError("SIMPLE mosaicking does not support preProcessScenes")
    elif mosaicking == "TILE":
        # TODO CHECK IF TILE WORKS!
        prop_name = "tiles"
    elif mosaicking == "ORBIT":
        prop_name = "orbits"
    
    get_values = f"""
        function preProcessScenes(collections) {{
            throw new Error("SEPARATE" + JSON.stringify(collections) + "SEPARATE" + JSON.stringify(collections.scenes.{prop_name}) + "SEPARATE");
        }}
    """

    # Replace evaluate pixel function with own debug function
    sh_request.payload["evalscript"] = replace_function(
        evalscript,
        "preProcessScenes",
        get_values)

    # Intercept and get sample and scene
    try:
        sh_request.get_data()
    except DownloadFailedException as e:
        cleaned = e.args[0].replace("\\", "").split("SEPARATE")
    coll = json.loads(cleaned[1])
    scene = json.loads(cleaned[2])
    coll.update({"scenes": {prop_name: scene}})
    return json.dumps(coll)
