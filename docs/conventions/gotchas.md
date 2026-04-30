# 已知坑点

## HTTP 无 SSL

- 站点当前跑在 HTTP（`http://43.160.229.133`），不是 HTTPS
- **`navigator.clipboard` 在 HTTP 下不可用**，一键复制使用 `document.execCommand('copy')` 降级
- **Cookie `secure` 必须为 `false`**，否则登录后 session 无法写入

## 中文 URL 编码

- 中文用户名和标签 slug 在 `<Link href>` 中需要用 `encodeURIComponent` 编码
- 对应页面的 `params` 读取后需要用 `decodeURIComponent` 解码
- 如果不做，中文路径会 404

## SQLite 文本比较

- SQLite 的 `=` 是**二进制比较**（区分大小写）
- 登录邮箱的 `toLowerCase()` 不能省
- 字符串 `"0"` 在 JavaScript 中是 truthy，做布尔判断必须用 `=== "1"` / `!== "1"`

## 移动端延迟

- Next.js `<Link>` 默认 `prefetch` 会在 touch 时发起 RSC 请求，造成 1-3 秒延迟
- 所有 Link 已加 `prefetch={false}`
- `sticky` 定位在部分移动浏览器有性能问题，Navbar 目前使用 `relative`

## 默认值回填

- 编辑页的 checkbox（`copyable`, `anonymous`）必须传 `defaultChecked` 而非用 `value`/`checked`
- 否则编辑时拿不到当前状态

## `notFound()` 的使用

- Profile 页和标签页用 `notFound()` 处理不存在的资源
- 需要确保查询条件正确（已加 `decodeURIComponent`）
