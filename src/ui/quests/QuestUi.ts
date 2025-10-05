import { QuestManager } from '@/questManager/QuestManager.ts';

class QuestUi {
  private static singleton: QuestUi | null = null;

  private questContainer: HTMLElement;
  private questsList: HTMLElement;
  private questDetail: HTMLElement;
  private questManager: QuestManager;

  private constructor() {
    this.questManager = QuestManager.getSingleton();

    this.questContainer = document.getElementById('quests')!;
    this.questsList = document.getElementById('quests-list')!;
    this.questDetail = document.getElementById('quest-detail')!;

    if (!this.questContainer || !this.questsList || !this.questDetail) {
      console.error('Quest UI elements not found in DOM.');
    }

    // Obsługa kliknięć w listę questów
    this.questsList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const questId = target.dataset.questId;
      if (questId) {
        this.showQuestDetail(questId);
      }
    });
  }

  static getSingleton(): QuestUi {
    if (!QuestUi.singleton) {
      QuestUi.singleton = new QuestUi();
    }
    return QuestUi.singleton;
  }

  /** Otwiera dziennik gracza */
  openJournal() {
    this.questContainer.style.display = 'block';
    this.refreshQuestList();
  }

  /** Zamyka dziennik */
  closeJournal() {
    this.questContainer.style.display = 'none';
  }

  /** Czyści listę questów i szczegóły */
  clearUi() {
    this.questsList.innerHTML = '';
    this.questDetail.innerHTML = '';
  }

  /** Odświeża listę questów */
  refreshQuestList() {
    this.clearUi();

    const activeQuests = this.questManager.getActiveQuests();
    if (activeQuests.length === 0) {
      this.questsList.innerHTML = '<li>Brak aktywnych zadań</li>';
      return;
    }

    for (const quest of activeQuests) {
      const li = document.createElement('li');
      li.textContent = `${quest.name}`;
      li.dataset.questId = quest.id;
      li.classList.add('quest-item');
      this.questsList.appendChild(li);
    }
  }

  /** Pokazuje szczegóły konkretnego questa */
  showQuestDetail(questId: string) {
    const quest = this.questManager.getQuest(questId);
    if (!quest) return;

    const current = quest.stages[quest.currentStage];
    const next = quest.stages[quest.currentStage + 1];

    this.questDetail.innerHTML = `
      <h3>${quest.name}</h3>
      <p><strong>Etap:</strong> ${quest.currentStage + 1}/${quest.stages.length}</p>
      <p><strong>Opis:</strong> ${current.description}</p>
      ${next ? `<p><em>Następny cel:</em> ${next.description}</p>` : ''}
      <p style="color:${quest.isCompleted ? 'limegreen' : 'orange'}">
        ${quest.isCompleted ? '✅ Ukończony' : '🕓 W toku'}
      </p>
    `;
  }
}

export default QuestUi;
