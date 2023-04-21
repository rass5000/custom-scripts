import debug
import datetime as dt

from py_mini_racer import MiniRacer
from hypothesis import given, strategies as st
from sentinelhub import (
    SentinelHubRequest,
    DataCollection,
    MimeType,
    BBox,
    bbox_to_dimensions,
    CRS,
    SHConfig,
    DownloadFailedException
)

config = SHConfig()

with open("script.js", "r") as file:
    evalscript = file.read()

with open("./js/eval_utils.js", "r") as file:
    eval_utils = file.read()

evalscript = evalscript + "\n" + eval_utils


@st.composite
def scenes(draw, start=dt.datetime(1970,1,1), end=dt.datetime.now()):
    date = draw(st.datetimes(start, end))
    dateFrom = date.replace(hour=0, minute=0, second=0, microsecond=0)
    dateTo = date.replace(hour=23, minute=59, second=59, microsecond=0)
    tile = dict(cloudCoverage=draw(st.floats(0, 100)), date=date.isoformat())
    return dict(
        dateFrom=dateFrom.isoformat(), 
        dateTo=dateTo.isoformat(), 
        tile=tile)


@st.composite
def orbit_scenes_eval(draw, n, min_value=dt.datetime(1970,1,1), max_value=dt.datetime.now()):
    start = draw(st.datetimes(min_value=min_value, max_value=max_value))
    end = draw(st.datetimes(min_value=start, max_value=max_value))
    return {
        "from": start.isoformat(),
        "to": end.isoformat(),
        "orbits": draw(st.lists(
            scenes(start=start, end=end),
            min_size=n,
            max_size=n))
        }


@st.composite
def orbit_pre_process(draw, min_value=dt.datetime(1970,1,1), max_value=dt.datetime.now()):
    start = draw(st.datetimes(min_value=min_value, max_value=max_value))
    end = draw(st.datetimes(min_value=start, max_value=max_value))
    return {
        "from": start.isoformat(),
        "to": end.isoformat(),
        "scenes": {"orbits": draw(st.lists(
            scenes(start=start, end=end),
            min_size=1))
        }}


@st.composite
def orbit_eval(draw, values, n_min=1, min_value=dt.datetime(1970,1,1), max_value=dt.datetime.now()):
    timeseries = draw(st.lists(values, min_size=n_min))
    n = len(timeseries)
    scenes = draw(orbit_scenes_eval(n, min_value, max_value))
    return timeseries, scenes


observations = st.fixed_dictionaries({
    "B04": st.floats(0, 1),
    "B08": st.floats(0, 1),
    "DN": st.integers(0, 8000),
    "dataMask": st.sampled_from((0, 1)) # If only certain numbers are allowed use sampled_from
    })

ctx = MiniRacer()
ctx.eval(evalscript)

examp = orbit_pre_process().example()
print(examp)
print(ctx.call("preProcessScenes", examp))


@given(sample=orbit_eval(observations))
def test_eval(sample):
    ctx.call("evaluatePixel", *sample)

@given(coll=orbit_pre_process())
def test_pre_process(coll):
    ctx.call("preProcessScenes", coll)
