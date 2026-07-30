// =============================================================
// 成就系统 —— 全局成就定义 + 触发 + 持久化
// =============================================================
var ACHIEVEMENTS = (function () {
  'use strict';

  // 成就定义
  var DEFS = [
    { id: 'first_answer',   name: '总要有个第一次！',  desc: '开始第一次答题',                       icon: 'images/achievements/1.png' },
    { id: 'tenth_answer',   name: '答题糕手',          desc: '完成十次游戏流程',                     icon: 'images/achievements/2.png' },
    { id: 'first_minigame', name: '小游戏爱好者',      desc: '首次从首页小游戏入口进入任意小游戏', icon: 'images/achievements/3.png' },
    { id: 'instructions',   name: '说明书爱好者',      desc: '在进行第一次游戏前进入游戏说明模块',   icon: 'images/achievements/4.png' }
  ];

  var LOCK_ICON = 'images/achievements/questionmark.png';

  // 从 localStorage 加载已解锁的成就
  var unlocked = {};
  try {
    unlocked = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
  } catch (e) {
    unlocked = {};
  }

  // 当前会话中新解锁的成就（用于游戏结束页展示）
  var sessionUnlocked = [];
  // 用于累计跨局答题次数（单题计数）
  var totalAnswered = parseInt(localStorage.getItem('quiz_total_answered') || '0', 10);
  // 用于累计跨局游戏完成次数（到达游戏结束画面）
  var totalSessions = parseInt(localStorage.getItem('quiz_total_sessions') || '0', 10);

  function saveUnlocked() {
    try { localStorage.setItem('quiz_achievements', JSON.stringify(unlocked)); } catch (e) {}
  }

  function saveTotalAnswered() {
    try { localStorage.setItem('quiz_total_answered', String(totalAnswered)); } catch (e) {}
  }

  function saveTotalSessions() {
    try { localStorage.setItem('quiz_total_sessions', String(totalSessions)); } catch (e) {}
  }

  // 解锁一个成就，返回 true 表示新解锁
  function unlock(id) {
    if (unlocked[id]) return false; // 已解锁
    var def = DEFS.find(function(d) { return d.id === id; });
    if (!def) return false;
    unlocked[id] = true;
    saveUnlocked();
    sessionUnlocked.push(def);
    return true;
  }

  // 检查是否已解锁
  function isUnlocked(id) {
    return !!unlocked[id];
  }

  // 获取锁定图标
  function getLockIcon() {
    return LOCK_ICON;
  }

  // 获取所有已解锁的成就
  function getUnlocked() {
    return DEFS.filter(function(d) { return unlocked[d.id]; });
  }

  // 获取本次会话新解锁的成就
  function getSessionUnlocked() {
    return sessionUnlocked.slice();
  }

  // 清空本次会话记录（新游戏开始时调用）
  function resetSession() {
    sessionUnlocked = [];
  }

  // 增加总答题数
  function addAnsweredCount(count) {
    totalAnswered += count;
    saveTotalAnswered();
  }

  function getTotalAnswered() {
    return totalAnswered;
  }

  // 游戏完成次数管理（每到达一次游戏结束画面 +1）
  function addSessionCount(count) {
    var before = totalSessions;
    totalSessions += (count || 1);
    saveTotalSessions();
    return before;
  }

  function getTotalSessions() {
    return totalSessions;
  }

  // 清空所有成就（测试用）
  function clearAll() {
    unlocked = {};
    sessionUnlocked = [];
    totalAnswered = 0;
    totalSessions = 0;
    try {
      localStorage.removeItem('quiz_achievements');
      localStorage.removeItem('quiz_total_answered');
      localStorage.removeItem('quiz_total_sessions');
      localStorage.removeItem('quiz_has_played');
    } catch (e) {}
  }

  // 标记"已玩过游戏"（用于说明书爱好者成就判断）
  function markGamePlayed() {
    try { localStorage.setItem('quiz_has_played', 'true'); } catch (e) {}
  }

  function hasPlayedBefore() {
    try { return localStorage.getItem('quiz_has_played') === 'true'; } catch (e) { return false; }
  }

  return {
    DEFS: DEFS,
    LOCK_ICON: LOCK_ICON,
    unlock: unlock,
    isUnlocked: isUnlocked,
    getLockIcon: getLockIcon,
    getUnlocked: getUnlocked,
    getSessionUnlocked: getSessionUnlocked,
    resetSession: resetSession,
    addAnsweredCount: addAnsweredCount,
    getTotalAnswered: getTotalAnswered,
    addSessionCount: addSessionCount,
    getTotalSessions: getTotalSessions,
    clearAll: clearAll,
    markGamePlayed: markGamePlayed,
    hasPlayedBefore: hasPlayedBefore
  };
})();
