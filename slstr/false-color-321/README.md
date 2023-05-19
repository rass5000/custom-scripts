---
permalink: /slstr/false-color-321/
nav_exclude: true
---

# Sentinel-3 SLSTR False color composite

{% assign paths = page.dir | remove_first: "/" | split: "/" | join: "-"%}
<button class="btn btn-primary" id="toggle-script" onclick="toggleScript()">Show Script</button>
[Download Script](script.js){: .btn target="_blank" download="{{paths | append: ".js"}}"}
{: .mt-lg-4 }

<div id="script" style="display:none;"> 
{% highlight javascript %}
{% include_relative script.js %}
{% endhighlight %}
</div>

## Evaluate and visualize

 - [EO Browser](https://sentinelshare.page.link/r7yA){:target="_blank"}

## General description

The script for Sentinel-3 SLSTR uses reflectance bands S3, S2 and S1 to return a false color composite, which generally visualizes vegetation in red, non-vegetated ground in brown colors, clouds in white and water in black. 

## Description of representative images

SLSTR false color composite of the US. Acquired on 2021-06-13, processed by Sentinel Hub. 

![L8 NDVI](fig/fig1.png)




