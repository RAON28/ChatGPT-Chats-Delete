/**
 * 현재 테마를 감지하는 함수
 */
function getCurrentTheme() {
  const html = document.documentElement;
  return html.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * 테마에 따른 색상을 가져오는 함수
 */
function getThemeColors() {
  const theme = getCurrentTheme();
  if (theme === 'dark') {
    return {
      primary: '#10a37f',
      background: '#343541',
      surface: '#424242',
      text: '#ffffff',
      border: '#4e4e4e',
      borderLight: '#4e4e4e',
      surfaceSecondary: '#424242',
      surfaceTertiary: '#3e3f4b'
    };
  } else {
    return {
      primary: '#10a37f',
      background: '#ffffff',
      surface: '#f7f7f8',
      text: '#000000',
      border: '#e5e5e5',
      borderLight: '#d0d0d0',
      surfaceSecondary: '#f7f7f8',
      surfaceTertiary: '#f0f0f0'
    };
  }
}

/**
 * 커스텀 모달을 생성하는 함수
 */
function createCustomModal(message, onConfirm, onCancel) {
  const colors = getThemeColors();
  const theme = getCurrentTheme();

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: ${theme === 'dark' ? '#2f2f2f' : '#f9f9f9'};
    border: ${theme === 'dark' ? 'none' : `1px solid ${colors.borderLight}`};
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    margin-bottom: 20px;
    font-size: 16px;
    color: ${colors.text};
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: center;
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = onCancel === null ? window.t('confirm') : window.t('delete');
  confirmBtn.style.cssText = `
    padding: 6px 12px;
    border: none;
    background: ${onCancel === null ? 'transparent' : '#dc3545'};
    color: ${onCancel === null ? colors.text : 'white'};
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    ${onCancel === null ? `border: 1px solid ${theme === 'dark' ? '#4e4e4e' : '#d0d0d0'};` : ''}
    transition: all 0.2s ease;
  `;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = window.t('cancel');
  cancelBtn.style.cssText = `
    padding: 6px 12px;
    border: 1px solid ${theme === 'dark' ? '#4e4e4e' : '#d0d0d0'};
    background: transparent;
    color: ${colors.text};
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  `;

  // 버튼 이벤트 핸들러
  const addButtonEffects = (btn, isConfirm = false) => {
    const hoverBg = isConfirm ? '#c82333' : (theme === 'dark' ? '#424242' : '#ececec');
    const normalBg = isConfirm ? '#dc3545' : 'transparent';
    const borderColor = theme === 'dark' ? '#4e4e4e' : '#d0d0d0';

    ['focus', 'mouseenter'].forEach(event => {
      btn.addEventListener(event, () => {
        btn.style.background = hoverBg;
        if (!isConfirm) btn.style.borderColor = theme === 'dark' ? '#4e4e4e' : '#cccccc';
      });
    });

    ['blur', 'mouseleave'].forEach(event => {
      btn.addEventListener(event, () => {
        if (document.activeElement !== btn) {
          btn.style.background = normalBg;
          if (!isConfirm) btn.style.borderColor = borderColor;
        }
      });
    });
  };

  addButtonEffects(confirmBtn, onCancel !== null);
  addButtonEffects(cancelBtn);

  // 버튼 순서 변경: 취소, 삭제
  buttonContainer.appendChild(confirmBtn);

  // onCancel이 있을 때만 취소 버튼 추가
  if (onCancel !== null) {
    buttonContainer.insertBefore(cancelBtn, confirmBtn);
  }

  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onConfirm) onConfirm();
  });

  modalContent.appendChild(messageEl);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // 팝업창 밖을 클릭해도 취소되도록 이벤트 추가
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
      if (onCancel) onCancel();
    }
  });
}

/**
 * 채팅삭제 버튼을 생성하는 함수
 */
function createChatDeleteButton() {
  const colors = getThemeColors();

  const button = document.createElement('button');
  button.id = 'chat-delete-btn';
  button.textContent = window.t('chatDelete');
  button.style.cssText = `
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  `;

  // 포커스 효과 추가
  ['focus', 'mouseenter'].forEach(event => {
    button.addEventListener(event, () => {
      button.style.background = '#0d8a6f';
    });
  });

  ['blur', 'mouseleave'].forEach(event => {
    button.addEventListener(event, () => {
      if (document.activeElement !== button) {
        button.style.background = colors.primary;
      }
    });
  });

  button.addEventListener('click', () => {
    showActionButtons();
    addCheckboxes();
  });

  return button;
}

/**
 * 액션 버튼들을 표시하는 함수
 */
function showActionButtons() {
  const colors = getThemeColors();
  const theme = getCurrentTheme();
  const buttonContainer = document.getElementById('chat-delete-btn-container');

  if (buttonContainer) {
    buttonContainer.innerHTML = '';

    // 하트 아이콘 링크 추가
    const heartLink = document.createElement('a');
    heartLink.href = 'https://github.com/sponsors/RAON28';
    heartLink.target = '_blank';
    heartLink.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #e53e3e;
      padding: 4px;
      border-radius: 4px;
      margin-right: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
    `;

    heartLink.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 16 16" style="fill: currentColor;">
        <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002Z"></path>
      </svg>
    `;

    // 하트 아이콘 호버 효과
    heartLink.addEventListener('mouseenter', () => {
      heartLink.style.color = '#c53030';
      heartLink.style.transform = 'scale(1.1)';
      heartLink.style.background = theme === 'dark' ? '#424242' : '#f0f0f0';
      heartLink.style.borderColor = theme === 'dark' ? '#4e4e4e' : '#d0d0d0';
    });

    heartLink.addEventListener('mouseleave', () => {
      heartLink.style.color = '#e53e3e';
      heartLink.style.transform = 'scale(1)';
      heartLink.style.background = 'transparent';
      heartLink.style.borderColor = 'transparent';
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = window.t('cancel');
    cancelBtn.style.cssText = `
      background: transparent;
      color: ${colors.text};
      border: 1px solid ${colors.borderLight};
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin-right: 8px;
      transition: all 0.2s ease;
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = window.t('delete');
    deleteBtn.style.cssText = `
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    `;

    // 버튼 효과 함수
    const addButtonEffects = (btn, isDelete = false) => {
      const hoverBg = isDelete ? '#c82333' : (theme === 'dark' ? '#424242' : '#ececec');
      const normalBg = isDelete ? '#dc3545' : 'transparent';
      const borderColor = theme === 'dark' ? '#4e4e4e' : '#d0d0d0';

      ['focus', 'mouseenter'].forEach(event => {
        btn.addEventListener(event, () => {
          btn.style.background = hoverBg;
          if (!isDelete) btn.style.borderColor = theme === 'dark' ? '#4e4e4e' : '#cccccc';
        });
      });

      ['blur', 'mouseleave'].forEach(event => {
        btn.addEventListener(event, () => {
          if (document.activeElement !== btn) {
            btn.style.background = normalBg;
            if (!isDelete) btn.style.borderColor = borderColor;
          }
        });
      });
    };

    addButtonEffects(cancelBtn);
    addButtonEffects(deleteBtn, true);

    cancelBtn.addEventListener('click', () => {
      // 모든 체크박스 제거
      const checkboxes = document.querySelectorAll('.conversation-checkbox');
      checkboxes.forEach(checkbox => {
        if (checkbox.parentNode) {
          checkbox.parentNode.removeChild(checkbox);
        }
      });

      // 전체선택 체크박스 제거
      const selectAllContainer = document.querySelector('.select-all-container');
      if (selectAllContainer && selectAllContainer.parentNode) {
        selectAllContainer.parentNode.removeChild(selectAllContainer);
      }

      // 전체선택 체크박스 ID로도 찾아서 제거
      const selectAllCheckbox = document.getElementById('select-all-checkbox');
      if (selectAllCheckbox && selectAllCheckbox.parentNode) {
        selectAllCheckbox.parentNode.removeChild(selectAllCheckbox);
      }

      // 채팅 링크의 원래 기능 복원
      restoreChatLinks();

      showChatDeleteButton();
    });

    deleteBtn.addEventListener('click', () => {
      const selectedCheckboxes = document.querySelectorAll('.conversation-checkbox:checked');
      if (selectedCheckboxes.length === 0) {
        createCustomModal(window.t('noChatsSelected'), () => {
          // 확인 버튼 클릭 시 아무것도 하지 않음
        }, null);
        return;
      }

      createCustomModal(window.t('confirmDelete'), () => {
        // 함수가 로드될 때까지 기다린 후 실행
        const executeDelete = () => {
          if (window.deleteMultipleChats) {
            window.deleteMultipleChats();
          } else {
            setTimeout(executeDelete, 1000);
          }
        };

        executeDelete();
      }, () => {
        // 취소 버튼 클릭 시 아무것도 하지 않음
      });
    });

    buttonContainer.appendChild(heartLink);
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(deleteBtn);
  }
}

/**
 * 채팅삭제 버튼을 표시하는 함수
 */
function showChatDeleteButton() {
  const buttonContainer = document.getElementById('chat-delete-btn-container');
  if (buttonContainer) {
    buttonContainer.innerHTML = '';
    const button = createChatDeleteButton();
    buttonContainer.appendChild(button);
  }
}

/**
 * 채팅 링크의 원래 기능을 복원하는 함수
 */
function restoreChatLinks() {
  const conversations = document.querySelectorAll('a[href^="/c/"]');
  conversations.forEach(conversation => {
    const link = conversation.querySelector("a");
    if (link && link.style) {
      link.style.pointerEvents = "auto";
      link.style.cursor = "pointer";
    }

    // conversation의 클릭 이벤트 제거
    if (conversation.removeEventListener) {
      conversation.removeEventListener("click", conversation._clickHandler);
    }

    // conversation의 커서 스타일 복원
    if (conversation.style) {
      conversation.style.cursor = "default";
    }
  });
}

// 전역으로 함수 노출
window.showChatDeleteButton = showChatDeleteButton;
window.removeAllCheckboxesFromAddCheckboxes = removeAllCheckboxes;
window.restoreChatLinks = restoreChatLinks;

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 체크박스를 추가하는 함수
 */
function addCheckboxes() {
  if (!document || !document.querySelectorAll) {
    return;
  }

  let conversations = null;
  try {
    conversations = document.querySelectorAll('a[href^="/c/"]');
  } catch (error) {
    return;
  }

  if (!conversations || conversations.length === 0) {
    return;
  }

  const colors = getThemeColors();

  conversations.forEach((conversation, index) => {
    if (!conversation || !conversation.querySelector || !conversation.appendChild) {
      return;
    }

    let existingCheckbox = null;
    try {
      existingCheckbox = conversation.querySelector('.conversation-checkbox');
    } catch (error) {
      return;
    }

    // 기존 체크박스가 있으면 체크 상태를 저장하고 제거
    let isChecked = existingCheckbox ? existingCheckbox.checked : false;
    if (existingCheckbox) {
      existingCheckbox.remove();
    }

    // 새로운 flexbox 컨테이너 생성
    const flexContainer = document.createElement("div");
    flexContainer.style.cssText = `
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0;
    `;

    // 새로운 체크박스 생성
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "conversation-checkbox";
    checkbox.dataset.index = index;
    checkbox.style.cssText = `
      margin-right: 8px;
      margin-left: 4px;
      position: relative;
      top: 1px;
      accent-color: ${colors.primary};
      filter: ${getCurrentTheme() === 'dark' ? 'invert(1)' : 'none'};
    `;
    checkbox.checked = isChecked;

    // 체크박스 클릭 이벤트
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
      const clickedCheckbox = event.target;
      checkPreviousCheckboxes(clickedCheckbox);
      window.lastCheckedCheckbox = clickedCheckbox;
      updateSelectAllCheckbox();
    });

    flexContainer.appendChild(checkbox);

    // 기존 내용을 flexContainer로 이동
    while (conversation.firstChild) {
      flexContainer.appendChild(conversation.firstChild);
    }

    // flexContainer를 conversation에 추가
    conversation.appendChild(flexContainer);

    // 대화 링크의 클릭 이벤트 비활성화
    let link = null;
    try {
      link = conversation.querySelector("a");
    } catch (error) {
      // 에러 무시
    }

    if (link && link.style) {
      link.style.pointerEvents = "none";
      link.style.cursor = "default";
    }

    // conversation 전체에 클릭 이벤트 추가
    if (conversation.addEventListener && conversation.style) {
      const clickHandler = (event) => {
        // 체크박스 클릭이 아닐 때만 토글
        if (!event.target.classList.contains('conversation-checkbox')) {
          toggleCheckboxInConversation(conversation, event);
        }
      };

      conversation.addEventListener("click", clickHandler);
      conversation._clickHandler = clickHandler; // 핸들러 저장

      conversation.style.cursor = "pointer";
    }
  });

  addSelectAllCheckbox();
  addShiftKeyEventListeners();
}

/**
 * 대화에서 체크박스 토글하는 함수
 */
function toggleCheckboxInConversation(conversation, event) {
  event.preventDefault();
  event.stopPropagation();

  if (!conversation || !conversation.querySelector) {
    return;
  }

  const checkbox = conversation.querySelector('.conversation-checkbox');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    checkPreviousCheckboxes(checkbox);
    if (checkbox.checked) {
      window.lastCheckedCheckbox = checkbox;
    }
    updateSelectAllCheckbox();
  }
}

/**
 * 이전 체크박스들을 체크하는 함수 (Shift 클릭 지원)
 */
function checkPreviousCheckboxes(clickedCheckbox) {
  if (!clickedCheckbox) {
    return;
  }

  if (window.shiftPressed && window.lastCheckedCheckbox) {
    const allCheckboxes = Array.from(
      document.querySelectorAll('.conversation-checkbox')
    );
    const start = allCheckboxes.indexOf(window.lastCheckedCheckbox);
    const end = allCheckboxes.indexOf(clickedCheckbox);

    if (start === -1 || end === -1) {
      return;
    }

    const [lower, upper] = start < end ? [start, end] : [end, start];

    for (let i = lower; i <= upper; i++) {
      if (allCheckboxes[i]) {
        allCheckboxes[i].checked = true;
      }
    }
  }
}

/**
 * Shift 키 이벤트 리스너 추가
 */
function addShiftKeyEventListeners() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
      window.shiftPressed = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift") {
      window.shiftPressed = false;
    }
  });
}

/**
 * 전체선택 체크박스를 추가하는 함수
 */
function addSelectAllCheckbox() {
  if (!document || !document.querySelector) {
    return;
  }

  let historyContainer = null;
  try {
    historyContainer = document.querySelector('[id^="history"]');
  } catch (error) {
    return;
  }

  if (!historyContainer) {
    return;
  }

  if (historyContainer.querySelector('.select-all-container')) {
    return;
  }

  const colors = getThemeColors();

  const selectAllContainer = document.createElement('div');
  selectAllContainer.className = 'select-all-container';
  selectAllContainer.style.cssText = `
    padding: 8px 12px;
    border-bottom: 1px solid ${colors.borderLight};
    display: flex;
    align-items: center;
    margin-left: 8px;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'select-all-checkbox';
  checkbox.style.cssText = `
    margin-right: 8px;
    accent-color: ${colors.primary};
    filter: ${getCurrentTheme() === 'dark' ? 'invert(1)' : 'none'};
  `;

  const label = document.createElement('span');
  label.textContent = window.t('selectAll');
  label.style.cssText = `
    color: ${colors.text};
    font-size: 14px;
    font-weight: 500;
  `;

  checkbox.addEventListener('change', (e) => {
    const allCheckboxes = document.querySelectorAll('.conversation-checkbox');
    allCheckboxes.forEach(cb => {
      cb.checked = e.target.checked;
    });
  });

  selectAllContainer.appendChild(checkbox);
  selectAllContainer.appendChild(label);

  // 채팅 라벨 아래에 삽입
  const chatLabel = historyContainer.querySelector('h2');
  if (chatLabel && chatLabel.parentElement) {
    chatLabel.parentElement.insertBefore(selectAllContainer, chatLabel.nextSibling);
  }
}

/**
 * 전체선택 체크박스 상태를 업데이트하는 함수
 */
function updateSelectAllCheckbox() {
  const allCheckboxes = document.querySelectorAll('.conversation-checkbox');
  const checkedCheckboxes = document.querySelectorAll('.conversation-checkbox:checked');
  const selectAllCheckbox = document.getElementById('select-all-checkbox');

  if (selectAllCheckbox && allCheckboxes.length > 0) {
    if (checkedCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }
}

/**
 * 모든 체크박스를 제거하는 함수
 */
function removeAllCheckboxes() {
  if (!document || !document.querySelectorAll) {
    return;
  }

  let checkboxes = null;
  try {
    checkboxes = document.querySelectorAll('.conversation-checkbox');
  } catch (error) {
    return;
  }

  if (checkboxes) {
    checkboxes.forEach(checkbox => {
      if (checkbox && checkbox.parentNode) {
        checkbox.parentNode.removeChild(checkbox);
      }
    });
  }

  // 원래 구조로 복원
  let conversations = null;
  try {
    conversations = document.querySelectorAll('a[href^="/c/"]');
  } catch (error) {
    return;
  }

  conversations.forEach(conversation => {
    if (!conversation || !conversation.querySelector) {
      return;
    }

    // flexContainer 찾기
    const flexContainer = conversation.querySelector('div[style*="display: flex"][style*="align-items: center"]');
    if (flexContainer) {
      // flexContainer 안의 원래 내용들 추출
      const originalContent = flexContainer.querySelector('.flex.min-w-0.grow.items-center.gap-2\\.5');
      const trailingContent = flexContainer.querySelector('.trailing.highlight.text-token-text-tertiary');

      // conversation 내용을 완전히 비우고 원래 구조로 복원
      conversation.innerHTML = '';
      if (originalContent) {
        conversation.appendChild(originalContent);
      }
      if (trailingContent) {
        conversation.appendChild(trailingContent);
      }
    }
  });

  const selectAllContainer = document.querySelector('.select-all-container');
  if (selectAllContainer && selectAllContainer.parentNode) {
    selectAllContainer.parentNode.removeChild(selectAllContainer);
  }
}

/**
 * 채팅 라벨 옆에 버튼을 추가하는 함수
 */
function addChatDeleteButton() {
  if (!document || !document.getElementById || !document.querySelector) {
    return;
  }

  if (document.getElementById('chat-delete-btn-container')) return;

  // 채팅 라벨(h2) 정확히 찾기
  let chatLabel = null;
  try {
    chatLabel = document.querySelector('h2.__menu-label');
  } catch (error) {
    setTimeout(addChatDeleteButton, 2000);
    return;
  }

  if (!chatLabel) {
    setTimeout(addChatDeleteButton, 2000);
    return;
  }

  // h2를 flex row로 만들어 같은 줄에 배치
  chatLabel.style.display = 'flex';
  chatLabel.style.flexDirection = 'row';
  chatLabel.style.alignItems = 'center';
  chatLabel.style.justifyContent = 'space-between';

  // 버튼 컨테이너 생성
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'chat-delete-btn-container';
  buttonContainer.style.marginLeft = 'auto';
  buttonContainer.style.marginRight = '8px';

  const button = createChatDeleteButton();
  buttonContainer.appendChild(button);

  // h2 안에 버튼 추가
  chatLabel.appendChild(buttonContainer);
}

/**
 * 테마 변경 감지 및 색상 업데이트
 */
function updateThemeColors() {
  if (!document || !document.querySelectorAll || !document.getElementById) {
    return;
  }

  const colors = getThemeColors();
  const chatDeleteBtn = document.getElementById('chat-delete-btn');

  if (chatDeleteBtn && chatDeleteBtn.style) {
    chatDeleteBtn.style.background = colors.primary;
  }

  // 체크박스 색상 업데이트
  let checkboxes = null;
  try {
    checkboxes = document.querySelectorAll('.conversation-checkbox');
  } catch (error) {
    return;
  }

  if (checkboxes) {
    checkboxes.forEach(checkbox => {
      if (checkbox && checkbox.style) {
        checkbox.style.accentColor = colors.primary;
        checkbox.style.filter = getCurrentTheme() === 'dark' ? 'invert(1)' : 'none';
      }
    });
  }

  // 전체선택 체크박스 색상 업데이트
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (selectAllCheckbox && selectAllCheckbox.style) {
    selectAllCheckbox.style.accentColor = colors.primary;
    selectAllCheckbox.style.filter = getCurrentTheme() === 'dark' ? 'invert(1)' : 'none';
  }
}

// 최적화된 테마 변경 감지
const debouncedUpdateThemeColors = debounce(updateThemeColors, 100);

// 테마 변경 감지
const observer = new MutationObserver(() => {
  debouncedUpdateThemeColors();
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});

// 초기 실행 - 여러 번 시도
function initializeButton() {
  addChatDeleteButton();

  // 3초 후에도 버튼이 없으면 다시 시도
  setTimeout(() => {
    if (!document.getElementById('chat-delete-btn-container')) {
      addChatDeleteButton();
    }
  }, 3000);
}

// 페이지 로드 후 1초 뒤에 초기화
setTimeout(initializeButton, 1000);
