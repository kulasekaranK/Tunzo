import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSkeletonText, IonFooter } from '@ionic/angular/standalone';
import { AiService } from '../services/ai.service';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSkeletonText,
    IonFooter, MarkdownModule, MarkdownComponent
  ]
})
export class ChatPage implements OnInit {
  ngOnInit() {
  }
  message = '';
  chatHistory = signal<{ role: 'user' | 'model'; text: string }[]>([]);
  loading = signal(false);

  constructor(private aiService: AiService) {}

  async sendMessage() {
    if (!this.message.trim()) return;

    const currentMsgText = this.message;
    
    // 1. **Capture the current history state *BEFORE* adding the new message.**
    // This is the correct history of previous turns for the API.
    const historyForService = this.chatHistory(); 

    // 2. Add the user message to the local signal for immediate display.
    this.chatHistory.update((h) => [...h, { role: 'user', text: currentMsgText }]);
    
    this.message = '';
    this.loading.set(true);

    // 3. Pass the *previous* history, plus the *new* prompt text.
    // NOTE: The user's current message is sent as the `prompt`.
    const aiResponse = await this.aiService.chat(currentMsgText, historyForService);
    
    // 4. Update the history with the model's response.
    this.chatHistory.update((h) => [...h, { role: 'model', text: aiResponse || '' }]);
    this.loading.set(false);
  }


}
