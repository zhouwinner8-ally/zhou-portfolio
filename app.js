const accountMeta = {
  1: { name: '大模型求职', alt: '大模型求职账号主页与笔记封面' },
  2: { name: '上岸分享', alt: '求职上岸分享账号主页与笔记封面' },
  3: { name: '华为资讯', alt: '华为招聘资讯账号主页与笔记封面' },
  4: { name: 'OD 学长', alt: '华为 OD 求职辅导学长账号主页与笔记封面' },
  5: { name: 'OD 辅导', alt: '华为 OD 辅导账号主页与笔记封面' },
  6: { name: 'OD 日更', alt: '华为 OD 每日更新账号主页与笔记封面' }
};

const accountTabs = [...document.querySelectorAll('.account-tabs [role="tab"]')];
const accountPanel = document.querySelector('#account-panel');
const accountImage = document.querySelector('#account-image');
const accountName = document.querySelector('#active-account-name');
const phoneDots = [...document.querySelectorAll('.phone-dots i')];
let accountTimer;

function selectAccount(tab, focus = false) {
  const account = tab.dataset.account;
  const meta = accountMeta[account];
  accountTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  phoneDots.forEach((dot, index) => dot.classList.toggle('active', index === Number(account) - 1));
  accountPanel.classList.add('changing');
  clearTimeout(accountTimer);
  accountTimer = setTimeout(() => {
    accountImage.src = `assets/account-${account}.jpg`;
    accountImage.alt = meta.alt;
    accountName.textContent = meta.name;
    accountPanel.setAttribute('aria-labelledby', tab.id);
    accountPanel.scrollTo({ top: 0, behavior: 'auto' });
    accountPanel.classList.remove('changing');
  }, 180);
  if (focus) tab.focus();
}

accountTabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener('click', () => selectAccount(tab));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % accountTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + accountTabs.length) % accountTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = accountTabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectAccount(accountTabs[nextIndex], true);
  });
});

document.querySelectorAll('[data-account-direction]').forEach(button => {
  button.addEventListener('click', () => {
    const currentIndex = accountTabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    const direction = Number(button.dataset.accountDirection);
    const nextIndex = (currentIndex + direction + accountTabs.length) % accountTabs.length;
    selectAccount(accountTabs[nextIndex]);
    accountTabs[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

const experiences = [
  {period:'2024.03 — 2026.08 · 广州',company:'广州慕课科技有限公司',role:'销售运营 · 知识付费项目',points:['独立运营 5 个小红书矩阵账号，围绕求职搜索需求规划内容。','参与内容获客、私域承接、销售转化和售后反馈业务链路。','结合咨询问题、用户画像与成交反馈复盘内容表现。'],tags:['内容获客','用户咨询','数据复盘']},
  {period:'2025.10 — 2026 · 广州',company:'体态健身 KOC 项目',role:'内容及私域社群运营 · 兼职',points:['参与短视频选题讨论、现场拍摄和素材整理。','维护 4 个私域社群，覆盖约 2,000 名用户。','配合直播预告、互动承接与课程案例物料制作。'],tags:['真人 IP','拍摄协作','社群运营']},
  {period:'2020.09 — 2024.06',company:'湖南工业大学',role:'经济学院 · ACCA 专业',points:['ACCA 已通过 9/13。','互联网＋创新创业大赛省级二等奖，负责战略市场分析。','曾任校学生社团联合会新媒体部部长，累计发布图文 100＋篇。'],tags:['ACCA','新媒体部','市场分析']}
];

const experienceTabs = [...document.querySelectorAll('.experience-tabs [role="tab"]')];
const experiencePanel = document.querySelector('#exp-panel');
let experienceTimer;

function selectExperience(tab) {
  const data = experiences[experienceTabs.indexOf(tab)];
  experienceTabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
  experiencePanel.classList.add('changing');
  clearTimeout(experienceTimer);
  experienceTimer = setTimeout(() => {
    document.querySelector('#exp-period').textContent = data.period;
    document.querySelector('#exp-company').textContent = data.company;
    document.querySelector('#exp-role').textContent = data.role;
    document.querySelector('#exp-points').replaceChildren(...data.points.map(point => { const item = document.createElement('li'); item.textContent = point; return item; }));
    document.querySelector('#exp-tags').replaceChildren(...data.tags.map(label => { const item = document.createElement('span'); item.textContent = label; return item; }));
    experiencePanel.setAttribute('aria-labelledby', tab.id);
    experiencePanel.classList.remove('changing');
  }, 180);
}

experienceTabs.forEach(tab => tab.addEventListener('click', () => selectExperience(tab)));

document.querySelectorAll('[data-experience-direction]').forEach(button => {
  button.addEventListener('click', () => {
    const currentIndex = experienceTabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    const direction = Number(button.dataset.experienceDirection);
    const nextIndex = (currentIndex + direction + experienceTabs.length) % experienceTabs.length;
    selectExperience(experienceTabs[nextIndex]);
    experienceTabs[nextIndex].focus();
  });
});

const imageDialog = document.querySelector('#image-dialog');
const enlargedImage = document.querySelector('#enlarged-image');
document.querySelector('#account-enlarge').addEventListener('click', () => {
  enlargedImage.src = accountImage.src;
  enlargedImage.alt = accountImage.alt;
  imageDialog.classList.remove('redact-qr');
  imageDialog.showModal();
  document.body.classList.add('modal-open');
});
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-image]');
  if (!trigger) return;
  enlargedImage.src = trigger.dataset.image;
  enlargedImage.alt = trigger.dataset.alt;
  imageDialog.classList.toggle('redact-qr', trigger.dataset.redact === 'qr');
  imageDialog.showModal();
  document.body.classList.add('modal-open');
});
document.querySelector('.close-image').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target !== imageDialog) return;
  const rect = imageDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
});
imageDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

const copyFeedback = document.querySelector('#copy-feedback');
document.querySelectorAll('.copy-contact').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    document.querySelectorAll('.copy-contact').forEach(item => {
      item.textContent = '复制';
      item.classList.remove('copied');
    });
    button.textContent = '已复制';
    button.classList.add('copied');
    copyFeedback.textContent = `${button.dataset.label}已复制`;
    setTimeout(() => {
      button.textContent = '复制';
      button.classList.remove('copied');
      copyFeedback.textContent = '';
    }, 1800);
  });
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' });
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
