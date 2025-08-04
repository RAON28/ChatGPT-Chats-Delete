/**
 * 선택된 대화들을 일괄 삭제하는 함수
 */
async function deleteMultipleChats() {
  const selectedConversations = getSelectedConversations();

  if (selectedConversations.length === 0) {
    removeAllCheckboxes();

    if (window.restoreChatLinks) {
      window.restoreChatLinks();
    }

    if (window.showChatDeleteButton) {
      window.showChatDeleteButton();
    }
    chrome.runtime.sendMessage({ action: "deleteComplete" });
    return;
  }

  let processedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < selectedConversations.length; i++) {
    const result = await deleteConversation(selectedConversations[i]);
    if (result) {
      processedCount++;
    } else {
      skippedCount++;
    }

    const progress = Math.round(((i + 1) / selectedConversations.length) * 100);
    chrome.runtime.sendMessage({
      action: "updateProgress",
      buttonId: "bulk-delete",
      progress: progress,
    });
  }

  removeAllCheckboxes();

  const selectAllContainer = document.querySelector('.select-all-container');
  if (selectAllContainer && selectAllContainer.parentNode) {
    selectAllContainer.parentNode.removeChild(selectAllContainer);
  }

  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (selectAllCheckbox && selectAllCheckbox.parentNode) {
    selectAllCheckbox.parentNode.removeChild(selectAllCheckbox);
  }

  if (window.restoreChatLinks) {
    window.restoreChatLinks();
  }

  if (window.showChatDeleteButton) {
    window.showChatDeleteButton();
  }

  chrome.runtime.sendMessage({
    action: "operationComplete",
    buttonId: "bulk-delete",
  });
}

/**
 * 선택된 대화들을 가져오는 함수
 */
function getSelectedConversations() {
  return [...document.querySelectorAll(Selectors.conversationsCheckbox)];
}

/**
 * 모든 체크박스를 제거하는 함수
 */
function removeAllCheckboxes() {
  if (window.removeAllCheckboxesFromAddCheckboxes) {
    window.removeAllCheckboxesFromAddCheckboxes();
  } else {
    const allCheckboxes = document.querySelectorAll(`.${CHECKBOX_CLASS}`);
    allCheckboxes.forEach((checkbox) => checkbox.remove());
  }
}

/**
 * 개별 대화를 삭제하는 함수
 */
async function deleteConversation(checkbox) {
  await delay(100);

  const conversationElement = checkbox.parentElement;

  const interactiveElement = conversationElement.querySelector(Selectors.INTERACTIVE_ELEMENT_SELECTOR);
  if (!interactiveElement) {
    const title =
      conversationElement.querySelector(Selectors.TITLE_SELECTOR)
        ?.textContent || "이 대화";
    alert(window.t('cannotDeleteConversation').replace('{title}', title));
    return false;
  }

  const hoverEvent = new MouseEvent("mouseover", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  interactiveElement.dispatchEvent(hoverEvent);
  await delay(200);

  try {
    const threeDotButton = await waitForElement(
      Selectors.threeDotButton,
      conversationElement.parentElement,
      1000
    );

    const pointerDownEvent = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      pointerType: "mouse",
    });
    threeDotButton.dispatchEvent(pointerDownEvent);
    await delay(300);

    const deleteButton = await waitForDeleteButton();

    if (deleteButton) {
      deleteButton.click();

      const confirmButton = await waitForElement(Selectors.confirmDeleteButton);
      if (confirmButton) {
        confirmButton.click();
        await waitForElementToDisappear(Selectors.confirmDeleteButton);
        return true;
      }
    }
  } catch (error) {
    return false;
  }

  return false;
}

/**
 * 삭제 버튼을 기다리는 함수
 */
async function waitForDeleteButton(parent = document, timeout = 2000) {
  const selector = 'div[role="menuitem"]';
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeout) {
    const elements = parent.querySelectorAll(selector);
    const element = Array.from(elements).find(
      (el) => {
        if (el.querySelector(".text-token-text-error")) {
          return true;
        }

        const hasDeleteIcon = el.querySelector('svg') &&
          (el.querySelector('svg').innerHTML.includes('trash') ||
            el.querySelector('svg').innerHTML.includes('delete') ||
            el.querySelector('svg').innerHTML.includes('trash-2'));

        if (hasDeleteIcon) {
          return true;
        }

        const menuItems = parent.querySelectorAll('div[role="menuitem"]');
        if (menuItems.length > 0 && el === menuItems[menuItems.length - 1]) {
          return true;
        }

        return false;
      }
    );
    if (element) return element;
    await delay(100);
  }

  return null;
}

/**
 * 지연 함수
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 요소를 기다리는 함수
 */
async function waitForElement(selector, parent = document, timeout = 2000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    const element = parent.querySelector(selector);
    if (element) return element;
    await delay(100);
  }

  throw new Error(
    `${timeout}ms 내에 지정된 부모에서 요소 ${selector}를 찾을 수 없음`
  );
}

/**
 * 요소가 사라질 때까지 기다리는 함수
 */
async function waitForElementToDisappear(selector, timeout = 2000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    const element = document.querySelector(selector);
    if (!element) return;
    await delay(100);
  }

  throw new Error(`${timeout}ms 내에 요소 ${selector}가 사라지지 않음`);
}

// 전역으로 함수 노출
window.deleteMultipleChats = deleteMultipleChats;
window.getSelectedConversations = getSelectedConversations;
window.removeAllCheckboxes = removeAllCheckboxes;
