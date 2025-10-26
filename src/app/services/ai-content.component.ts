import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { AiService } from './ai.service';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-ai-content',
  templateUrl: './ai-content.component.html',
  styleUrls: ['./ai-content.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSkeletonText, MarkdownComponent],
})
export class AiContentComponent implements OnChanges {
  @Input() isShowHeading = false;
  @Input() isShowContent = false;
  @Input() prompt = '';

  heading = signal<string | undefined>(undefined);
  content = signal<string | undefined>(undefined);
  loading = signal(false);

  constructor(private aiService: AiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prompt'] && this.prompt) {
      this.generate();
    }
  }

  private async generate() {
    this.loading.set(true);
    this.heading.set(undefined);
    this.content.set(undefined);

    if (this.isShowHeading) {
      console.log(this.prompt);
      
      const headingPrompt = `${this.prompt}`;
    await  this.aiService.generateText(headingPrompt).then((text: any) => {
        this.heading.set(text);
      });
    }

    if (this.isShowContent) {
      const contentPrompt = `Generate a short, engaging paragraph (5-7 sentences) about this topic: "${this.prompt}"`;
     await this.aiService.generateText(contentPrompt).then((text: any ) => {
        this.content.set(text);
      });
    }

    // A simple way to stop loading. For a more robust solution, you could use Promise.all.
    // setTimeout(() => {
      this.loading.set(false);
    // }, 2000); // Adjust timeout as needed
  }
}