# 网络访问白名单

Codex 和脚本优先访问以下公开域名。请求方式优先使用 GET/HEAD，只做公开信息收集，不登录账号，不保存 Cookie、Token 或账号凭据。

```text
arxiv.org
export.arxiv.org
api.github.com
github.com
huggingface.co
hn.algolia.com
news.ycombinator.com
openai.com
anthropic.com
deepmind.google
ai.meta.com
microsoft.com
techcrunch.com
theverge.com
technologyreview.com
```

## 禁止访问方式

- 不登录 X/Twitter、小红书、Reddit 等账号态页面。
- 不绕过反爬。
- 不抓取付费墙、私有知识库或受版权保护全文。
- 不发送 POST/PUT/PATCH/DELETE 请求，除非后续有明确人工批准。

