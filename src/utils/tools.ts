// 生成8位随机字符串
export function generateRandomString(length = 10) {
  // 随机生成字符串
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 把 think标签转换为blockquote 标签
export function convertThinkTagToBlockquote(str: string): string {
  // 输入类型检查
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }

  // 处理空字符串
  if (str.trim() === "") {
    return "";
  }
  //
  return str
    .replace(/<think>/g, "<blockquote>")
    .replace(/<\/think>/g, "</blockquote>");
  // 使用 DOMParser 解析并修改 HTML，防止 XSS 攻击
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  // 查找所有 <think> 标签并替换为 <blockquote>
  const thinkTags = doc.querySelectorAll("think");
  thinkTags.forEach((tag) => {
    const blockquote = doc.createElement("blockquote");
    while (tag.firstChild) {
      blockquote.appendChild(tag.firstChild);
    }
    tag.parentNode?.replaceChild(blockquote, tag);
  });
  // 返回修改后的 HTML 字符串
  return doc.body.innerHTML;
}

/**
 * 换算文件大小
 * @param bytes 文件大小
 * @returns 文件大小
 */
export function formatFileSize(bytes: number) {
  if (bytes === 0 || !bytes) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024));

  return (
    parseFloat((bytes / Math.pow(1024, exponent)).toFixed(2)) +
    " " +
    units[exponent]
  );
}
