'use client'

import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, VolumeX, Settings, Home, RotateCcw, Shield, Users, FileText, Clock, TrendingUp, Play, Pause } from 'lucide-react';
import gameData from './components/GameData.js';

export default function MidnightLoginGamebook() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'ended'
  const [currentNodeId, setCurrentNodeId] = useState(1);
  const [variables, setVariables] = useState({ ...gameData.variables });
  const [grantedTags, setGrantedTags] = useState(new Set());
  const [nodeHistory, setNodeHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [triggeredRecently, setTriggeredRecently] = useState(new Set()); // 최근 발동된 트리거 추적
  const [activeTooltip, setActiveTooltip] = useState(null); // 활성화된 툴팁

  // 변수별 이모지와 이름 매핑
  const variableInfo = {
    sec: { 
      emoji: '🛡️', 
      name: '보안', 
      color: 'text-blue-400',
      description: '사이버 보안 수준입니다. 높을수록 시스템이 안전하지만, 과도하면 업무에 지장을 줄 수 있습니다.'
    },
    avail: { 
      emoji: '⚡', 
      name: '가용성', 
      color: 'text-green-400',
      description: '서비스 연속성을 나타냅니다. 낮아지면 직원들의 불만이 커지고 업무에 차질이 생깁니다.'
    },
    evid: { 
      emoji: '📋', 
      name: '증거', 
      color: 'text-yellow-400',
      description: '수집한 증거의 양입니다. 충분히 모으면 상황을 명확하게 설명할 수 있게 됩니다.'
    },
    trust: { 
      emoji: '🤝', 
      name: '신뢰', 
      color: 'text-purple-400',
      description: '동료들의 신뢰도입니다. 낮아지면 협조를 얻기 어려워지고 평판에 영향을 준니다.'
    },
    downtime: { 
      emoji: '⏰', 
      name: '중단시간', 
      color: 'text-red-400',
      description: '서비스 중단 시간(분)입니다. 너무 길어지면 상사의 압박이 들어올 수 있습니다.'
    },
    exfil_watch: { 
      emoji: '👁️', 
      name: '감시', 
      color: 'text-orange-400',
      description: '수상한 활동을 지켜본 횟수입니다. 누적되면 심각한 보안 사고가 확인될 수 있습니다.'
    }
  };

  // 페이지 넘기기 사운드 재생 함수
  const playPageFlipSound = () => {
    if (soundEnabled) {
      try {
        const audio = new Audio('/page-flip.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Sound play failed:', e));
      } catch (e) {
        console.log('Sound initialization failed:', e);
      }
    }
  };

  // 조건 평가 함수
  const evaluateCondition = (condition) => {
    if (!condition) return true;
    
    try {
      // 변수들을 로컬 스코프에 주입
      const { sec, avail, evid, trust, downtime, exfil_watch, exfil_confirmed, new_alert_seen } = variables;
      
      // 조건 문자열을 안전하게 평가
      const result = eval(condition.replace(/!/g, '!'));
      return result;
    } catch (e) {
      console.warn('조건 평가 실패:', condition, e);
      return false;
    }
  };

  // 트리거 확인 및 실행
  const checkTriggers = () => {
    for (const trigger of gameData.triggers) {
      if (trigger.type === 'state' && 
          evaluateCondition(trigger.condition) && 
          !triggeredRecently.has(trigger.id)) { // 최근에 발동되지 않은 트리거만 확인
        
        if (trigger.to) {
          // 트리거를 최근 발동 목록에 추가
          setTriggeredRecently(prev => new Set([...prev, trigger.id]));
          
          // 3초 후에 트리거 쿨다운 해제 (트리거 노드에서 벗어날 충분한 시간)
          setTimeout(() => {
            setTriggeredRecently(prev => {
              const newSet = new Set(prev);
              newSet.delete(trigger.id);
              return newSet;
            });
          }, 3000);
          
          setCurrentNodeId(trigger.to);
          return true;
        }
        if (trigger.grant_tag) {
          setGrantedTags(prev => new Set([...prev, trigger.grant_tag]));
        }
        if (trigger.set_flag) {
          setVariables(prev => ({ ...prev, ...trigger.set_flag }));
        }
      }
    }
    return false;
  };

  // 노드 진입 트리거 확인
  const checkOnEnterTriggers = (nodeId) => {
    for (const trigger of gameData.triggers) {
      if (trigger.type === 'on_enter' && 
          trigger.nodes && 
          trigger.nodes.includes(nodeId) && 
          evaluateCondition(trigger.condition)) {
        
        if (trigger.set_flag) {
          setVariables(prev => ({ ...prev, ...trigger.set_flag }));
        }
        
        if (trigger.to) {
          setTimeout(() => setCurrentNodeId(trigger.to), 1000); // 1초 후 트리거
          return true;
        }
      }
    }
    return false;
  };

  // 선택지 클릭 핸들러
  const handleChoice = (choice) => {
    setActiveTooltip(null); // 툴팡 닫기
    playPageFlipSound();
    setIsTransitioning(true);
    
    // 트리거 노드(90, 91)에서 벗어나면 해당 트리거 쿨다운 초기화
    if (currentNodeId === 90 || currentNodeId === 91) {
      const triggerToReset = currentNodeId === 90 ? 'T1_availability_pressure' : 'T2_security_spread';
      setTimeout(() => {
        setTriggeredRecently(prev => {
          const newSet = new Set(prev);
          newSet.delete(triggerToReset);
          return newSet;
        });
      }, 1000); // 1초 후 쿨다운 해제
    }
    
    // 효과 적용
    if (choice.effects) {
      setVariables(prev => {
        const newVars = { ...prev };
        Object.entries(choice.effects).forEach(([key, value]) => {
          if (typeof newVars[key] === 'number') {
            newVars[key] += value;
          } else {
            newVars[key] = value;
          }
        });
        return newVars;
      });
    }

    // 히스토리 추가
    setNodeHistory(prev => [...prev, currentNodeId]);

    setTimeout(() => {
      if (choice.to === 'END') {
        setGameState('ended');
      } else if (choice.to === 'RETURN') {
        // 트리거 노드에서 돌아가기
        if (nodeHistory.length > 0) {
          const returnNodeId = nodeHistory[nodeHistory.length - 1];
          setCurrentNodeId(returnNodeId);
          // 히스토리에서 제거
          setNodeHistory(prev => prev.slice(0, -1));
        }
      } else {
        setCurrentNodeId(choice.to);
      }
      setIsTransitioning(false);
    }, 300);
  };

  // 현재 노드 가져오기
  const getCurrentNode = () => {
    return gameData.nodes.find(node => node.id === currentNodeId);
  };

  // 선택지 필터링 (조건부 선택지)
  const getAvailableChoices = (choices) => {
    return choices.filter(choice => {
      if (!choice.requires) return true;
      
      // 태그 요구사항 확인
      if (choice.requires.includes('tag:')) {
        const requiredTag = choice.requires.split('tag:')[1];
        return grantedTags.has(requiredTag);
      }
      
      // 조건 평가
      return evaluateCondition(choice.requires);
    });
  };

  // 엔딩 결정 함수
  const determineEnding = () => {
    for (const ending of gameData.endings) {
      if (evaluateCondition(ending.condition)) {
        return ending;
      }
    }
    return gameData.endings[gameData.endings.length - 1]; // 기본 엔딩
  };

  // 게임 시작
  const startGame = () => {
    playPageFlipSound();
    setGameState('playing');
    setCurrentNodeId(gameData.start);
    setVariables({ ...gameData.variables });
    setGrantedTags(new Set());
    setNodeHistory([]);
    setTriggeredRecently(new Set());
  };

  // 게임 리셋
  const resetGame = () => {
    playPageFlipSound();
    setGameState('start');
    setCurrentNodeId(1);
    setVariables({ ...gameData.variables });
    setGrantedTags(new Set());
    setNodeHistory([]);
    setTriggeredRecently(new Set());
    setActiveTooltip(null); // 툴팁 초기화
  };

  // 툴팁 토글 함수
  const toggleTooltip = (variableKey, event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setActiveTooltip(activeTooltip === variableKey ? null : variableKey);
  };

  // 전체 화면 클릭 시 툴팁 닫기
  const handleScreenClick = () => {
    if (activeTooltip) {
      setActiveTooltip(null);
    }
  };

  // 트리거 확인 (변수 변경시)
  useEffect(() => {
    if (gameState === 'playing') {
      const triggered = checkTriggers();
      if (!triggered) {
        checkOnEnterTriggers(currentNodeId);
      }
    }
  }, [variables, currentNodeId, gameState]);

  // 시작 화면
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div 
          className="max-w-lg w-full bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url('/paper_background.jpg')` }}
        >
          <div className="bg-black/70 backdrop-blur-sm p-8 text-center text-white">
            <div className="mb-8">
              <img 
                src="/cover.png" 
                alt="게임 커버" 
                className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                onError={(e) => { e.target.src = '/event.png'; }}
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {gameData.title}
              </h1>
              <div className="text-lg mb-6 leading-relaxed space-y-2">
                <p>당신이 벌써 보안업계에 들어온 지 6개월이 지났습니다.</p>
                <p>수습기간을 마치고, 정규직으로 승진할 수 있을까요?</p>
                <p className="text-yellow-300">오늘도 사고가 없기를 기도하며… </p><p>당신은 업무를 시작합니다...</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
              >
                <Play size={20} />
                <span>게임 시작</span>
              </button>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center space-x-2 hover:text-white transition-colors"
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>사운드 {soundEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 엔딩 화면
  if (gameState === 'ended') {
    const ending = determineEnding();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
        <div 
          className="max-w-2xl w-full bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundImage: `url('/paper_background.jpg')` }}
        >
          <div className="bg-black/80 backdrop-blur-sm p-8 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
              {ending.name}
            </h1>
            
            <div className="mb-8">
              <p className="text-lg leading-relaxed mb-6">
                {ending.summary}
              </p>
            </div>

            {/* 최종 점수 표시 - 이모지 포함 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-sm">
              {Object.entries(variables).filter(([key]) => key !== 'exfil_confirmed' && key !== 'new_alert_seen').map(([key, value]) => {
                const info = variableInfo[key];
                if (!info) return null;
                
                return (
                  <div key={key} className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">{info.emoji}</div>
                    <div className="text-sm text-gray-300 mb-1">{info.name}</div>
                    <div className={`text-2xl font-bold ${info.color}`}>
                      {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>다시 시작</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  const currentNode = getCurrentNode();
  if (!currentNode) return <div>노드를 찾을 수 없습니다.</div>;

  const availableChoices = getAvailableChoices(currentNode.choices || []);
  const imageUrl = currentNode.image ? `/${currentNode.image}` : '/event.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex flex-col" onClick={handleScreenClick}>
      {/* 상단 상태바 - 이모지 포함 */}
      <div className="bg-black/50 backdrop-blur-sm p-4 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto relative">
          {/* 데스크톱 뷰 */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={resetGame}
                className="text-white/70 hover:text-white transition-colors"
              >
                <Home size={20} />
              </button>
              <h1 className="text-lg font-semibold text-white">{gameData.title}</h1>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/90">
              {Object.entries(variables).filter(([key]) => key !== 'exfil_confirmed' && key !== 'new_alert_seen').map(([key, value]) => {
                const info = variableInfo[key];
                if (!info) return null;
                
                return (
                  <div key={key} className="relative">
                    <button
                      onClick={(e) => toggleTooltip(key, e)}
                      className="flex items-center space-x-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-all duration-200"
                    >
                      <span className="text-lg">{info.emoji}</span>
                      <span className={info.color}>
                        {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                      </span>
                    </button>
                    
                    {/* 툴팅 */}
                    {activeTooltip === key && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg p-3 w-64 z-50 shadow-xl border border-white/20">
                        <div className="text-center mb-2">
                          <div className="text-xl mb-1">{info.emoji}</div>
                          <div className="font-semibold text-sm">{info.name}</div>
                        </div>
                        <div className="text-gray-300 leading-relaxed">{info.description}</div>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/20"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 모바일 뷰 */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={resetGame}
                className="text-white/70 hover:text-white transition-colors"
              >
                <Home size={20} />
              </button>
              <h1 className="text-sm font-semibold text-white">{gameData.title}</h1>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white/70 hover:text-white transition-colors"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs text-white/90">
              {Object.entries(variables).filter(([key]) => key !== 'exfil_confirmed' && key !== 'new_alert_seen').map(([key, value]) => {
                const info = variableInfo[key];
                if (!info) return null;
                
                return (
                  <div key={key} className="relative">
                    <button
                      onClick={(e) => toggleTooltip(key, e)}
                      className="bg-white/10 rounded px-2 py-1 text-center w-full hover:bg-white/20 transition-all duration-200"
                    >
                      <div className="text-sm">{info.emoji}</div>
                      <div className={`font-bold ${info.color}`}>
                        {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                      </div>
                    </button>
                    
                    {/* 모바일 툴팅 */}
                    {activeTooltip === key && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg p-3 w-48 z-50 shadow-xl border border-white/20">
                        <div className="text-center mb-2">
                          <div className="text-lg mb-1">{info.emoji}</div>
                          <div className="font-semibold">{info.name}</div>
                        </div>
                        <div className="text-gray-300 leading-relaxed text-xs">{info.description}</div>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/20"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className={`max-w-4xl w-full bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
          style={{ backgroundImage: `url('/paper_background.jpg')` }}
        >
          <div className="bg-black/70 backdrop-blur-sm min-h-[500px] md:min-h-[600px] flex flex-col">
            {/* 이미지 섹션 */}
            <div className="flex-shrink-0">
              <img 
                src={imageUrl}
                alt="장면 이미지" 
                className="w-full h-48 md:h-80 object-cover"
                onError={(e) => { e.target.src = '/event.png'; }}
              />
            </div>

            {/* 텍스트 및 선택지 섹션 */}
            <div className="flex-1 p-4 md:p-8 flex flex-col">
              <div className="flex-1">
                <p className="text-white text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                  {currentNode.text}
                </p>
              </div>

              {/* 선택지 */}
              {availableChoices.length > 0 && (
                <div className="space-y-3">
                  {availableChoices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoice(choice)}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-left p-4 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40 transform hover:scale-[1.02]"
                      disabled={isTransitioning}
                    >
                      <span className="text-yellow-400 font-semibold mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm md:text-base">{choice.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 컨트롤 - 데스크톱만 */}
      <div className="hidden md:block bg-black/50 backdrop-blur-sm p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white/70 hover:text-white transition-colors flex items-center space-x-2"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-sm">사운드 {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
