import katex from 'katex'
import html2canvas from 'html2canvas'

/**
 * 字符串转换成图片
 * @param {string} body
 * @returns {string} img
 */
export const processLatexInBody = async (body) => {
  const matches = body.match(/\$([^$]+)\$/g);
  if (matches) {
    for (const match of matches) {
      const latex = match.slice(1, -1);
      try {
        const imageUrl = await formConvertLatexToImage(latex);
        body = body.replace(match, `<img src="${imageUrl}" data-latex="${latex}" />`);
      } catch (err) {
        throw new Error(`公式转换失败: ${latex}`);
      }
    }
  }
  return body;
}

export const convertDomToBase64 = async (domElement) => {
  try {
    // 使用 html2canvas 将 DOM 元素转换为 canvas
    const canvas = await html2canvas(domElement);
    // 将 canvas 的内容转换为 base64 图片
    const base64Image = canvas.toDataURL();
    return base64Image;
  } catch (error) {
    console.error('转换失败:', error);
    return null;
  }
};

/**
 * 公式转换成图片
 * @param {*} latex
 * @return base64 图片url
 */
export const formConvertLatexToImage = async (latex) => {
  const existingDiv = document.getElementById('latexImageDiv');
  if (existingDiv) {
      existingDiv.innerHTML = ''; // 清空现有的 div 元素内容
  } else {
      const div = document.createElement('div');
      div.id = 'latexImageDiv';
      document.body.appendChild(div);
  }
  const html = katex.renderToString(latex, { displayMode: false, output: 'html' });
  const div = document.getElementById('latexImageDiv');
  div.style.position = 'fixed';
  div.style.top = '-9999px';
  div.innerHTML = html
  const saveUrl = await convertDomToBase64(div);
  return saveUrl;
}

/**
 * 提取图片内的共识
 * @param {string} value
 * @return 习题内容
 */
export const formTranFormValue = (value) => {
    const imgRegex = /<img[^>]+data-latex="([^"]+)"[^>]*>/g;
    const dotRegex = /&lt;dot&gt;(.*?)&lt;\/dot&gt;/g;
    const body = value.replace(imgRegex, (match, latex) => {
      return `$${latex}$`;
    }).replace(dotRegex, "<dot>$1</dot>");
    return {
      examType: "multi_blank",
      type: "multi_blank",
      body
    }
  }