/**
 * Trình biên dịch & Hiển thị Nội dung Ký ức Lịch sử (HTML & Markdown)
 * Hỗ trợ định dạng phong phú: Màu sắc, Căn giữa, Chữ đậm, Nghiêng, Trích dẫn, và Ảnh Cloudinary
 */

export function renderStoryContent(content: string): string {
  if (!content) return '';

  let html = content;

  // 1. Chuyển đổi cú pháp ảnh Markdown sang thẻ <figure> đẹp mắt
  // Cú pháp: ![Chú thích ảnh](https://res.cloudinary.com/...)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
    const caption = alt ? alt.trim() : 'Ảnh tư liệu lịch sử';
    return `
      <figure class="my-6 rounded-2xl overflow-hidden border border-amber-200/90 shadow-md bg-stone-900 group">
        <img 
          src="${src}" 
          alt="${caption}" 
          class="w-full h-auto max-h-[520px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
          loading="lazy"
        />
        <figcaption class="text-center text-xs text-stone-600 py-2.5 px-4 bg-amber-50/80 italic font-sans border-t border-amber-100 flex items-center justify-center gap-1.5">
          <span>📷</span>
          <span>${caption}</span>
        </figcaption>
      </figure>
    `;
  });

  // 2. Chuyển đổi Markdown Tiêu đề H2, H3, H4
  html = html.replace(/^#### (.*$)/gim, '<h4 class="font-serif font-bold text-lg text-slate-900 mt-6 mb-2.5 text-red-900">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="font-serif font-black text-xl sm:text-2xl text-slate-900 mt-8 mb-3.5 pb-2 border-b border-amber-200/90 text-red-950">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-10 mb-4 pb-2 border-b-2 border-red-700 text-red-900">$1</h2>');

  // 3. Chuyển đổi Markdown Trích dẫn (Blockquote)
  html = html.replace(/^> "(.*?)"$/gim, '<blockquote class="border-l-4 border-red-700 pl-5 py-3 my-5 italic bg-amber-50/70 text-slate-800 rounded-r-2xl font-serif text-base sm:text-lg leading-relaxed shadow-xs">"$1"</blockquote>');
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-red-700 pl-5 py-3 my-5 italic bg-amber-50/70 text-slate-800 rounded-r-2xl font-serif text-base sm:text-lg leading-relaxed shadow-xs">$1</blockquote>');

  // 4. Chuyển đổi Markdown Chữ đậm, Nghiêng, Gạch ngang
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-950 font-bold">$1</strong>');
  html = html.replace(/~~(.*?)~~/g, '<del class="text-slate-400">$1</del>');

  // 5. Chuyển đổi Markdown Links [Text](url)
  html = html.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-700 font-bold underline hover:text-red-900 transition-colors">$1</a>');

  // 6. Xử lý đoạn văn nếu nội dung thuần text xuống dòng
  // Nếu chưa có thẻ <p> hoặc <div> bao bọc, đổi \n\n thành ngắt đoạn
  if (!html.includes('<p>') && !html.includes('<div>')) {
    html = html
      .split(/\n\s*\n/)
      .map(para => {
        const p = para.trim();
        if (!p) return '';
        if (p.startsWith('<figure') || p.startsWith('<h') || p.startsWith('<blockquote')) {
          return p;
        }
        return `<p class="mb-4 text-slate-800 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('\n');
  }

  return html;
}
