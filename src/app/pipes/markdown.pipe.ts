import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true, // If using standalone components
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeHtml {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    let result = value;

    // --- BASIC MARKDOWN TO HTML CONVERSION (No library) ---

    // 1. Replace bold (**text** or __text__)
    // This is a simple regex that captures text between two asterisks/underscores
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // 2. Replace italics (*text* or _text_)
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    result = result.replace(/_(.*?)_/g, '<em>$1</em>');

    // 3. Convert Newlines to <br> (for simple paragraph breaks)
    result = result.replace(/\n/g, '<br>');

    // 4. Handle simple list items (requires more complex regex for true list rendering,
    // so we'll skip for this minimal example to prevent complex bugs, but include a simple marker)
    // If your AI uses lists extensively, this approach is insufficient.
    
    // -----------------------------------------------------------

    // FINAL STEP: Sanitize the generated HTML string and mark it as safe.
    // WARNING: This bypasses Angular's built-in XSS defense. Only use this
    // for content you are certain is safe (like the output from your own AI).
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}