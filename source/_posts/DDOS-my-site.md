---
title: AWS WAF automations
date: 2019-09-02 18:12:11
tags:
    - aws
    - security
    - waf
    - ddos
    - serverless
---
{% asset_img "ddos_teaser.png" %}

A friend of mine suggested that I should write something about [AWS WAF security automations](https://aws.amazon.com/solutions/aws-waf-security-automations/). This is mentioned in the [Use AWS WAF to Mitigate OWASP’s Top 10 Web Application Vulnerabilities](https://d0.awsstatic.com/whitepapers/Security/aws-waf-owasp.pdf) whitepaper and there are plenty of materials about this solution on the net. So I thought, instead of writing about what it is / how to set it up, let have some funs ddos my own site and actually see how it works.

I'm going to try to break my site with 3 different methods.

### 1. http flood attack

My weapon of choice is [PyFlooder](https://github.com/D4Vinci/PyFlooder).

{% asset_img "hold-your-tears-1.JPG" %}

After about 5000 requests, the lambda function started to kick in and blocked my access to the side. I can also see my ip has been blocked on WAF http flood rule.

{% asset_img "403.JPG" %} {% asset_img "waf-flood.JPG" %}

I then removed the ip from the blocked list and onto the next attack.

### 2. XSS

Next up is XSS, input a simple `<script>` tag on to the uri and I got 403 error straight away.

{% asset_img "i-xss-403.JPG" %}

### 3. Badbot

For this method I used [scrapy](https://scrapy.org/). Wrote a short spider script to crawl my site, targeting the [honeypot url](https://docs.aws.amazon.com/solutions/latest/aws-waf-security-automations/deployment.html#step3).

```python
import scrapy
class mySpider(scrapy.Spider):
    name='td-1'
    start_urls = ['https://blog.tdinvoke.net']
    def parse(self, response):
        for url in response.css('a::attr("href")'):
            yield {'url': url.extract()}
        for next_page in response.css('a[rel="nofollow"]::attr("href")'):
            yield response.follow(next_page.extract(), self.parse)
```

Release the spider!!!!
{% asset_img "i-spider.JPG" %}
and got the 403 error as expected.
{% asset_img "403-spider.JPG" %}

### Issues encountered/thoughts:

- Setting up the bot wasn't easy as I expected, but I learnt a lot about scrapy.

- I accidentally/unknowingly deleted the badbot ip list from the badbot rule. Only found out about the silly mistake by going through the whole pipeline (api gateway -> lambda -> waf ip list -> waf rule) to troubleshoot the issue.

- PyFlooder is not compatible with windows os. Had to spin up a ubuntu vm to run it.

- Learnt how to add file to source for Hexo. Not complicated at all, just chuck the file into /source folder. ***Do not*** use the [hexo-generator-robotstxt](https://www.npmjs.com/package/hexo-generator-robotstxt) plugin, I almost broken my site because of it.

- Overall this was an interesting exercise - breaking is always more fun than building!
