// 번역 데이터
const translations = {
    ko: {
        popupTitle: "ChatGPT 채팅 삭제",
        popupDescription: "ChatGPT 페이지에서 채팅삭제 버튼을 클릭하여 대화를 일괄 삭제할 수 있습니다.",
        availableOnChatGPT: "ChatGPT 페이지에서 사용 가능",
        onlyAvailableOnChatGPT: "ChatGPT 페이지에서만 사용 가능",
        support: "지원하기"
    },
    en: {
        popupTitle: "ChatGPT Chats Delete",
        popupDescription: "Click the delete button on the ChatGPT page to bulk delete conversations.",
        availableOnChatGPT: "Available on ChatGPT page",
        onlyAvailableOnChatGPT: "Only available on ChatGPT page",
        support: "Support"
    },
    ja: {
        popupTitle: "ChatGPTチャット削除",
        popupDescription: "ChatGPTページの削除ボタンをクリックして会話を一括削除できます。",
        availableOnChatGPT: "ChatGPTページで利用可能",
        onlyAvailableOnChatGPT: "ChatGPTページでのみ利用可能",
        support: "サポート"
    },
    zh: {
        popupTitle: "ChatGPT聊天删除",
        popupDescription: "在ChatGPT页面点击删除按钮以批量删除对话。",
        availableOnChatGPT: "在ChatGPT页面可用",
        onlyAvailableOnChatGPT: "仅在ChatGPT页面可用",
        support: "支持"
    },
    es: {
        popupTitle: "Eliminar Chats de ChatGPT",
        popupDescription: "Haz clic en el botón de eliminar en la página de ChatGPT para eliminar conversaciones en masa.",
        availableOnChatGPT: "Disponible en la página de ChatGPT",
        onlyAvailableOnChatGPT: "Solo disponible en la página de ChatGPT",
        support: "Apoyar"
    },
    de: {
        popupTitle: "ChatGPT Chat löschen",
        popupDescription: "Klicken Sie auf der ChatGPT-Seite auf die Löschen-Schaltfläche, um Gespräche in Massen zu löschen.",
        availableOnChatGPT: "Verfügbar auf der ChatGPT-Seite",
        onlyAvailableOnChatGPT: "Nur auf der ChatGPT-Seite verfügbar",
        support: "Unterstützen"
    }
};

// 언어 감지 함수
function detectLanguage() {
    try {
        // 브라우저 언어 설정 확인
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) {
            return browserLang;
        }
        return 'en';
    } catch (error) {
        return 'en';
    }
}

// 번역 함수
function t(key) {
    try {
        const currentLang = detectLanguage();
        return translations[currentLang]?.[key] || translations['en'][key] || key;
    } catch (error) {
        return translations['en'][key] || key;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 번역 적용
    document.getElementById('popupTitleText').textContent = t('popupTitle');
    document.getElementById('popupDescription').textContent = t('popupDescription');
    document.getElementById('sponsorText').textContent = t('support');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.url && (tab.url.includes('chat.openai.com') || tab.url.includes('chatgpt.com'))) {
            document.getElementById('status').textContent = t('availableOnChatGPT');
        } else {
            document.getElementById('status').textContent = t('onlyAvailableOnChatGPT');
        }
    });
}); 