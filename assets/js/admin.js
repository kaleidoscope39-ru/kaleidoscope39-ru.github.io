const plansList = document.querySelector('[data-plans-list]');
const faqList = document.querySelector('[data-faq-list]');

function nextIndex(list, selector, attribute) {
  const values = Array.from(list.querySelectorAll(selector)).map((node) => Number(node.dataset[attribute]));
  return values.length ? Math.max(...values) + 1 : 0;
}

function renumberLegends(list, selector, label) {
  list.querySelectorAll(selector).forEach((node, index) => {
    const legend = node.querySelector('legend');
    if (legend) {
      legend.textContent = `${label} ${index + 1}`;
    }
  });
}

function createOptionRow(planIndex, optionIndex) {
  const row = document.createElement('div');
  row.className = 'form-grid option-grid';
  row.dataset.optionRow = '';
  row.dataset.optionIndex = String(optionIndex);
  row.innerHTML = `
    <label>Режим
      <input name="plans.${planIndex}.options.${optionIndex}.description" value="" required />
    </label>
    <label>Цена
      <input name="plans.${planIndex}.options.${optionIndex}.price" value="" required />
    </label>
    <button class="icon-button" type="button" data-remove-option aria-label="Удалить режим">×</button>
  `;
  return row;
}

function createPlanCard(planIndex) {
  const fieldset = document.createElement('fieldset');
  fieldset.dataset.planCard = '';
  fieldset.dataset.planIndex = String(planIndex);
  fieldset.innerHTML = `
    <legend>Тариф</legend>
    <button class="danger-button" type="button" data-remove-plan>Удалить тариф</button>
    <div class="form-grid compact">
      <label>Возраст
        <input name="plans.${planIndex}.age" value="" required />
      </label>
      <label>Название
        <input name="plans.${planIndex}.title" value="" required />
      </label>
    </div>
    <div data-options-list></div>
    <button class="secondary-button" type="button" data-add-option>Добавить режим</button>
  `;
  fieldset.querySelector('[data-options-list]').append(createOptionRow(planIndex, 0));
  return fieldset;
}

function createFaqCard(faqIndex) {
  const fieldset = document.createElement('fieldset');
  fieldset.dataset.faqCard = '';
  fieldset.dataset.faqIndex = String(faqIndex);
  fieldset.innerHTML = `
    <legend>Вопрос</legend>
    <button class="danger-button" type="button" data-remove-faq>Удалить вопрос</button>
    <label>Вопрос
      <input name="faq.${faqIndex}.question" value="" required />
    </label>
    <label>Ответ
      <textarea name="faq.${faqIndex}.answer" rows="3" required></textarea>
    </label>
  `;
  return fieldset;
}

document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.matches('[data-add-plan]')) {
    const planIndex = nextIndex(plansList, '[data-plan-card]', 'planIndex');
    plansList.append(createPlanCard(planIndex));
    renumberLegends(plansList, '[data-plan-card]', 'Тариф');
    return;
  }

  if (target.matches('[data-remove-plan]')) {
    target.closest('[data-plan-card]').remove();
    renumberLegends(plansList, '[data-plan-card]', 'Тариф');
    return;
  }

  if (target.matches('[data-add-option]')) {
    const plan = target.closest('[data-plan-card]');
    const optionsList = plan.querySelector('[data-options-list]');
    const optionIndex = nextIndex(optionsList, '[data-option-row]', 'optionIndex');
    optionsList.append(createOptionRow(plan.dataset.planIndex, optionIndex));
    return;
  }

  if (target.matches('[data-remove-option]')) {
    target.closest('[data-option-row]').remove();
    return;
  }

  if (target.matches('[data-add-faq]')) {
    const faqIndex = nextIndex(faqList, '[data-faq-card]', 'faqIndex');
    faqList.append(createFaqCard(faqIndex));
    renumberLegends(faqList, '[data-faq-card]', 'Вопрос');
    return;
  }

  if (target.matches('[data-remove-faq]')) {
    target.closest('[data-faq-card]').remove();
    renumberLegends(faqList, '[data-faq-card]', 'Вопрос');
  }
});
