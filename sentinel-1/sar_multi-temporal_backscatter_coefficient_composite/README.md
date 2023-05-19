---
permalink: /sentinel-1/sar_multi-temporal_backscatter_coefficient_composite/
nav_exclude: true
---

# Sentinel-1 Multi-temporal Backscatter Coefficient Composite
{% assign paths = page.dir | remove_first: "/" | split: "/" | join: "-"%}
<button class="btn btn-primary" id="toggle-script" onclick="toggleScript()">Show Script</button>
[Download Script](script.js){: .btn target="_blank" download="{{paths | append: ".js"}}"}
{: .mt-lg-4 }

<div id="script" style="display:none;"> 
{% highlight javascript %}
{% include_relative script.js %}
{% endhighlight %}
</div>

## Description  

For the interpretation of results, you can use The Synthetic Aperture Radar (SAR) Handbook: Comprehensive Methodologies for Forest Monitoring and Biomass Estimation, 2019: table 3.1 page 66.  
The book is available for free [here.](https://www.servirglobal.net/Global/Articles/Article/2674/sar-handbook-comprehensive-methodologies-for-forest-monitoring-and-biomass-estimation){:target="_blank"}  
The script visualizes Earth surface in False Color from Sentinel-1 data.   
It helps in maritime monitoring (ice monitoring, ship monitoring,...) land monitoring (agricolture, deforestation,...) and emergency management (flood monitoring, volcano monitoring, ...).  

## Examples
<img alt="Sentinel Hub Custom Script Contest" style="border-width:0" src="https://raw.githubusercontent.com/sentinel-hub/custom-scripts/master/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite/examples/etna_multitemporal_S1_composite.png" />


## Contributors:  

[Annamaria Luongo](https://twitter.com/annamaria_84){:target="_blank"}    