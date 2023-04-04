---
title: Custom Scripts by Application
---

# Test

{% assign all_applications = site.pages | map: "application" %}
{%- assign applications = "" | split: "" -%}
{% for item in all_applications %}
    {% if item %}
        {% assign applications = applications | concat: item %}
    {% endif %}
{% endfor %}
{% assign sensors = site.pages | map: "sensor" | uniq %}

# By Appplication

{% assign unique_apps = applications | uniq %}
{% for application in unique_apps %}
## {{application}}
    {% assign subset_app = site.pages | where:"application", application %}
    {% for script in subset_app %}
- [{{ script.title }}]({{script.url}})
    {% endfor %}
{% endfor %}

{% assign unique_apps = applications | uniq %}
{% for application in unique_apps %}
## {{application}}
    {% assign subset_app = site.pages | where:"application", application %}
    {% for script in subset_app %}
- {{script.categories}}
    {% endfor %}
{% endfor %}

# By Sensor

{% for sensor in sensors %}
    {% if sensor %}
## {{sensor}}
        {% assign subset_sensor = site.pages | where:"sensor", sensor %}
        {% for script in subset_sensor %}
- [{{ script.title }}]({{script.url}})
        {% endfor %}
    {% endif %}
{% endfor %}


