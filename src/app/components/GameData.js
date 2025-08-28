'use client'

const gameData = {
  "title": "한밤의 로그인",
  "lang": "ko",
  "version": "2.5_late_climax_edition",
  "format": "gamebook",
  "variables": {
    "sec": 0,
    "avail": 0,
    "evid": 0,
    "trust": 0,
    "downtime": 0,
    "exfil_watch": 0,
    "exfil_confirmed": false,
    "new_alert_seen": false
  },
  "start": 1,
  "triggers": [
    {
      "id": "T1_availability_pressure",
      "type": "state",
      "condition": "avail <= -3 || downtime >= 25",
      "to": 90,
      "description": "가용성 압박으로 상사의 즉시 조치 요구가 끼어듭니다."
    },
    {
      "id": "T2_security_spread",
      "type": "state",
      "condition": "sec <= -3",
      "to": 91,
      "description": "의심스러운 외부 전송 조짐이 뚜렷해집니다."
    },
    {
      "id": "T3_evidence_unlock",
      "type": "state",
      "condition": "evid >= 3",
      "grant_tag": "official_comms",
      "description": "증거가 모여 공식 안내 선택지가 해금됩니다."
    },
    {
      "id": "T4_trust_penalty",
      "type": "state",
      "condition": "trust <= -2",
      "grant_tag": "coop_penalty",
      "description": "신뢰가 낮아 협조 지연·거부 페널티가 발생할 수 있습니다."
    },
    {
      "id": "T5_impossible_travel_event",
      "type": "on_enter",
      "nodes": [30, 31, 32],
      "condition": "!new_alert_seen",
      "to": 21,
      "set_flag": { "new_alert_seen": true },
      "description": "최종 보고 단계에서 ‘불가능한 이동’ 알림이 발생합니다."
    },
    {
      "id": "T6_exfil_confirm",
      "type": "state",
      "condition": "exfil_watch >= 2",
      "set_flag": { "exfil_confirmed": true },
      "description": "지켜보기 선택을 거듭하면 실제 외부 전송이 확정됩니다."
    }
  ],
  "nodes": [
    {
      "id": 1, "image": "prologue.png",
      "text": "야간 교대 근무 중, 경보판에 '불가능한 이동' 알림이 표시됩니다. 로비에서 카드가 사용된 직후, 동일한 계정으로 해외 IP에서 원격 접속이 시도되었습니다. 이 모순된 상황에 어떻게 대응하시겠습니까?",
      "choices": [
        { "text": "프로토콜에 따라 해당 계정을 즉시 잠급니다.", "to": 2, "effects": { "sec": 1, "avail": -1, "trust": -1, "downtime": 5 } },
        { "text": "로비 보안팀에 연락해 방문자 신원부터 확인합니다.", "to": 3, "effects": { "evid": 1, "downtime": 3 } }
      ]
    },
    {
      "id": 2, "text": "계정을 잠그자마자 개발팀에서 연락이 왔습니다. “지금 긴급 배포 작업 중인데 갑자기 접속이 끊겼습니다. 확인 부탁드립니다.” 다급한 목소리가 들려옵니다.",
      "choices": [
        { "text": "상황을 설명하고, 필수 기능만 허용하는 부분 차단을 제안합니다.", "to": 4, "effects": { "sec": 1, "avail": -1, "trust": 1, "downtime": 10 } },
        { "text": "급한 작업이라니, 임시 예외를 발급하여 배포 작업만 허용합니다.", "to": 5, "effects": { "sec": -1, "avail": 1, "trust": 1 } }
      ]
    },
    {
      "id": 3, "image": "lobby_courier.png",
      "text": "로비 보안팀에서 답신이 왔습니다. “외주 점검 인력이라고는 하는데, 제출된 야간 작업 계획서에는 없는 이름입니다.”",
      "choices": [
        { "text": "작업 서류 사진을 요청하고, 해당 업무 담당자에게 교차 확인합니다.", "to": 6, "effects": { "evid": 1, "downtime": 4 } },
        { "text": "일단 급한 용무일 수 있으니, 감시를 조건으로 통과시킵니다.", "to": 7, "effects": { "sec": -1, "avail": 1, "trust": 1 } }
      ]
    },
    {
      "id": 4, "text": "부분 차단을 실행하자 일부 서비스가 느려졌다는 불만이 접수됩니다. 그와 동시에, 한 번도 사용된 적 없는 PC에서 관리자 암호 입력 시도가 여러 번 감지됩니다.",
      "choices": [
        { "text": "해당 PC가 위치한 층의 네트워크를 즉시 격리합니다.", "to": 8, "effects": { "sec": 1, "avail": -1, "downtime": 6 } },
        { "text": "추가 행동을 유도하기 위해, 일단 지켜보며 로그를 수집합니다.", "to": 9, "effects": { "evid": 1, "sec": -1 } }
      ]
    },
    {
      "id": 5, "text": "임시 예외를 허용하자마자, 해당 계정이 다른 시스템에서도 추가 로그인하는 것이 확인됩니다. 비정상적인 활동 범위 확장입니다.",
      "choices": [
        { "text": "허용한 예외를 즉시 철회하고 보안 사유를 기록으로 남깁니다.", "to": 8, "effects": { "sec": 1, "trust": -1, "downtime": 2 } },
        { "text": "원격 공동 작업일 수 있습니다. 5분만 더 지켜보기로 합니다.", "to": 10, "effects": { "sec": -2, "avail": 1 } }
      ]
    },
    {
      "id": 6, "text": "담당자에게서 답장이 왔습니다. “금일 야간 작업은 없습니다. 전산 착오인 것 같습니다.” 명백한 거짓 신원입니다.",
      "choices": [
        { "text": "보안팀에 즉시 출입 통제를 요청하고 신원을 확보하도록 지시합니다.", "to": 11, "effects": { "sec": 1, "evid": 1, "downtime": 4 } },
        { "text": "로비에 대기만 지시하고, 내부 접속 시도를 추적해 목적을 파악합니다.", "to": 9, "effects": { "trust": 1, "downtime": 1 } }
      ]
    },
    {
      "id": 7, "image": "loading_dock_door.png", "text": "방문자를 통과시키자마자, 서버실과 데이터센터 구역의 출입문 알림이 연달아 울립니다. 동선이 비정상적입니다.",
      "choices": [
        { "text": "해당 구역의 모든 문을 원격으로 잠그고 보안팀 지원을 호출합니다.", "to": 11, "effects": { "sec": 1, "avail": -1, "downtime": 5 } },
        { "text": "CCTV로 동선을 추적하며 최종 목적지를 파악합니다.", "to": 12, "effects": { "sec": -1, "evid": 1, "downtime": 2 } },
        { "text": "예상 동선 앞의 카드 리더기를 원격으로 무력화하여 가둡니다.", "to": "7B", "effects": { "sec": 1, "evid": 1, "avail": -1, "downtime": 4 } }
      ]
    },
    {
      "id": "7B", "image": "trap_and_block.png", "text": "당신의 예측대로, 침입자는 무력화된 카드 리더기 앞에서 멈춰 섰습니다. 그는 당황하며 다른 길을 찾고 있지만, 당신이 설치한 '디지털 함정'에 갇힌 셈입니다. 이 확실한 증거 영상을 확보했습니다.",
      "choices": [
        { "text": "영상을 증거로 저장하고, 현장에 보안팀을 보내 인계합니다.", "to": 16, "effects": { "evid": 2, "sec": 1, "downtime": 3 } },
        { "text": "이제 원격으로 접속한 공범이 움직일 것입니다. 그를 잡기 위해 지켜봅니다.", "to": 9, "effects": { "evid": 1, "sec": -1, "downtime": 1 } }
      ]
    },
    {
      "id": 8, "image": "partial_lockdown.png", "text": "네트워크 격리 조치로 일부 업무 시스템이 중단됐다는 불만이 접수됩니다. 그 사이, 격리된 PC에서 파일 목록을 빠르게 스캔한 흔적이 발견됩니다.",
      "choices": [
        { "text": "화면을 캡처하고 모든 활동 로그를 증거로 저장합니다.", "to": 13, "effects": { "evid": 1, "downtime": 2 } },
        { "text": "더 이상의 피해를 막기 위해, 전면 차단으로 전환합니다.", "to": 14, "effects": { "sec": 2, "avail": -2, "trust": -1, "downtime": 10 } }
      ]
    },
    {
      "id": 9, "text": "활동을 모니터링하는 중, 외부로 향하는 미세한 데이터 전송 시도가 감지됩니다. 암호화된 작은 패킷들입니다.",
      "choices": [
        { "text": "해당 PC의 외부 네트워크 연결만 즉시 차단합니다.", "to": 13, "effects": { "sec": 1, "avail": -1, "downtime": 3 } },
        { "text": "전송지를 파악하기 위해, 의도적으로 더 지켜봅니다. (허니팟)", "to": 15, "effects": { "evid": 1, "sec": -1, "exfil_watch": 1 } }
      ]
    },
    {
      "id": 10, "text": "방치된 예외 조치가 화를 불렀습니다. 두 위치에서 동시 다발적인 권한 상승 시도가 일어나고 있습니다. 명백한 계정 탈취 상황입니다.",
      "choices": [
        { "text": "상황의 심각성을 알리고, 관련된 모든 시스템을 즉시 중단시킵니다.", "to": 14, "effects": { "sec": 2, "avail": -2, "trust": -1, "downtime": 8 } },
        { "text": "활동 범위를 지켜보며, 공격자의 목표를 파악하는 데 집중합니다.", "to": 15, "effects": { "sec": -1, "evid": 1 } }
      ]
    },
    {
      "id": 11, "image": "evidence_usb_bag.png", "text": "보안팀이 로비에서 해당 인원을 확보했습니다. 그의 가방에서 미승인 USB 장치와 저장 매체들이 다수 발견됩니다.",
      "choices": [
        { "text": "모든 장비를 압수하고, 사진과 영상으로 증거를 확보합니다.", "to": 16, "effects": { "evid": 2, "sec": 1, "downtime": 5 } },
        { "text": "일단 귀가 조치하고, 인상착의와 상황만 기록해둡니다.", "to": 17, "effects": { "trust": 1, "evid": -1, "sec": -1, "downtime": 2 } }
      ]
    },
    {
      "id": 12, "image": "corridor_chase.png", "text": "CCTV 추적이 비상계단에서 끊겼습니다. 그와 동시에, 시스템에 알 수 없는 원격 관리 프로그램이 설치되었다는 경보가 발생합니다.",
      "choices": [
        { "text": "주변 구역만 봉쇄하고 즉시 현장 지원을 요청합니다.", "to": 13, "effects": { "sec": 1, "avail": -1, "trust": 1, "downtime": 4 } },
        { "text": "설치된 프로그램을 분석하며, 침입자의 다음 행동을 예측합니다.", "to": 15, "effects": { "evid": 1, "sec": -1 } }
      ]
    },
    {
      "id": 13, "text": "결정적인 증거를 확보하고 확산을 막았습니다. 이제 이 상황을 어떻게 공유하고 수습할지 결정해야 합니다.",
      "choices": [
        { "text": "[증거 확보] 공식 안내 채널을 통해 상황, 영향, 조치 계획을 공지합니다.", "to": 18, "requires": "tag:official_comms", "effects": { "trust": 1, "avail": 1, "downtime": 1 } },
        { "text": "아직은 혼란을 줄 때가 아닙니다. 조용히 사태를 수습하는 데 집중합니다.", "to": 18, "effects": { "trust": -1 } }
      ]
    },
    {
      "id": 14, "image": "full_lockdown.png", "text": "전면 차단으로 시스템 전체가 멈췄습니다. 관련 부서들로부터 원인과 해결 시점을 묻는 문의가 빗발칩니다.",
      "choices": [
        { "text": "서비스 중요도에 따라 복구 계획을 세우고, 예상 시간을 공유합니다.", "to": 18, "effects": { "avail": 1, "trust": 1, "downtime": 3 } },
        { "text": "위협이 100% 제거될 때까지 차단을 유지하겠다고 답합니다.", "to": 19, "effects": { "sec": 1, "avail": -1, "downtime": 5 } }
      ]
    },
    {
      "id": 15, "image": "trap_and_block.png", "text": "모니터링 끝에, 데이터가 전송되던 외부 서버의 IP 주소를 확보했습니다. 공격의 실체가 드러난 순간입니다.",
      "choices": [
        { "text": "해당 IP를 즉시 차단하고, 시스템 전체에서 관련 흔적을 추적합니다.", "to": 18, "effects": { "sec": 1, "evid": 1, "downtime": 2 } },
        { "text": "문제의 PC만 격리하고, 조용히 사건을 마무리합니다.", "to": 19, "effects": { "avail": 1, "trust": -1, "downtime": 1 } }
      ]
    },
    {
      "id": 16, "text": "확보한 증거가 충분합니다. 의심스러운 장비, 화면 기록, 비정상적인 출입 기록이 하나의 타임라인으로 정리됩니다.",
      "choices": [
        { "text": "책임자에게 보고하고, 아침 브리핑을 위한 질의응답 자료를 준비합니다.", "to": 20, "effects": { "evid": 1, "trust": 1, "downtime": 2 } },
        { "text": "내부 팀에만 공유하고, 조용히 시스템 복구에 집중합니다.", "to": 18, "effects": { "trust": -1 } }
      ]
    },
    {
      "id": 17, "text": "상황은 일단락된 듯 하지만, 설명할 수 없는 몇몇 로그 기록이 남아있습니다. 놓친 부분이 있을지도 모릅니다.",
      "choices": [
        { "text": "보안 카메라 영상을 다시 확인하며 놓친 단서를 찾습니다.", "to": 18, "effects": { "evid": 1, "downtime": 3 } },
        { "text": "추가 분석보다는 시스템 복구를 우선하기로 합니다.", "to": 19, "effects": { "avail": 1 } }
      ]
    },
    {
      "id": 18, "text": "사건은 마무리 국면에 접어들었습니다. 남은 이상 징후를 정리하고, 이제 사람들에게 상황을 어떻게 설명할지 결정해야 합니다.",
      "choices": [
        { "text": "필수 기능부터 순차적으로 재개하며, 그 순서와 이유를 투명하게 공개합니다.", "to": 30, "effects": { "avail": 1, "trust": 1, "downtime": 3 } },
        { "text": "모든 시스템이 정상화되었다고 알립니다. 약간 성급한 선언일 수 있습니다.", "to": 30, "effects": { "trust": 1, "avail": 1, "sec": -1 } }
      ]
    },
    {
      "id": 19, "text": "강경한 대응으로 보안은 지켰지만, 동료들의 불만은 커지고 있습니다. 막힌 시스템을 우회하려는 시도들도 늘어나고 있습니다.",
      "choices": [
        { "text": "예외 신청 절차를 안내하고, 모든 요청을 기록하는 것으로 타협합니다.", "to": 18, "effects": { "avail": 1, "evid": 1, "trust": 1, "downtime": 4 } },
        { "text": "원칙을 고수하며 현재의 강경한 기조를 유지합니다.", "to": 30, "effects": { "sec": 1, "avail": -1, "trust": -1, "downtime": 5 } }
      ]
    },
    {
      "id": 20, "image": "morning_briefing.png", "text": "창밖이 밝아오고 있습니다. 지난밤의 모든 증거, 분석, 복구 계획을 하나의 보고서로 정리해야 합니다.",
      "choices": [
        { "text": "내부 직원과 외부 고객에게 동시에 상황을 공지하고, 예상 질문 모음도 첨부합니다.", "to": 30, "effects": { "evid": 1, "trust": 1, "avail": 1 } },
        { "text": "우선 내부에만 상황을 공유하고 외부 반응을 지켜보기로 합니다.", "to": 30, "effects": { "trust": 1 } }
      ]
    },
    {
      "id": 21, "image": "alarm_dashboard.png", "text": "새로운 '불가능한 이동' 경보입니다. 동일 인물이 서울과 뉴욕에서 불과 몇 분 차이로 접속했습니다. 물리적으로 불가능한 상황입니다.",
      "choices": [
        { "text": "VPN 사용 오류일 수 있습니다. 해당 직원에게 직접 연락해 확인합니다.", "to": 22, "effects": { "evid": 1, "downtime": 5 } },
        { "text": "명백한 계정 탈취입니다. 두 세션 모두 즉시 강제 종료하고 계정을 잠급니다.", "to": 23, "effects": { "sec": 2, "avail": -1, "downtime": 2 } }
      ]
    },
    {
      "id": 22, "text": "직원과 통화한 결과, 해외 지사와의 협업을 위해 VPN을 사용한 것이 맞지만, 접속 위치가 뉴욕은 아니라고 합니다. 누군가 직원의 VPN 계정 정보를 이용하고 있습니다.",
      "choices": [
        { "text": "직원에게 상황을 알리고, 즉시 모든 계정의 암호를 재설정하도록 안내합니다.", "to": 24, "effects": { "sec": 1, "trust": 1, "downtime": 4 } },
        { "text": "뉴욕 IP의 활동을 주시하며, 공격자의 목적을 파악하기로 합니다.", "to": 25, "effects": { "sec": -1, "evid": 1 } }
      ]
    },
    {
      "id": 23, "text": "계정을 잠그자마자, 헬프데스크로 '긴급 암호 초기화 요청'이 접수됩니다. 방금 당신이 잠근 바로 그 계정입니다.",
      "choices": [
        { "text": "본인 확인을 위해, 등록된 번호로 직접 전화를 걸어 화상 인증을 요구합니다.", "to": 24, "effects": { "evid": 1, "sec": 1, "downtime": 4 } },
        { "text": "상황이 급박해 보이니, 규정을 어기고 일단 초기화해줍니다.", "to": 25, "effects": { "sec": -2, "trust": -1, "avail": 1 } }
      ]
    },
    {
      "id": 24, "text": "화상 통화를 요청하자, 상대방이 당황하며 통화를 끊습니다. 신원 도용 시도였음이 명백해졌습니다. 성공적으로 공격을 막아냈습니다.",
      "choices": [
        { "text": "이 시도 패턴을 새로운 탐지 규칙에 추가하여, 향후 자동 경보가 울리도록 설정합니다.", "to": 28, "effects": { "sec": 1, "evid": 1, "downtime": 2 } },
        { "text": "기록만 남기고, 현재 진행 중인 다른 위협 분석에 집중합니다.", "to": 28, "effects": { "evid": 1 } }
      ]
    },
    {
      "id": 25, "text": "섣부른 초기화가 최악의 결과를 낳았습니다. 방금 열어준 계정으로 시스템의 더 높은 권한을 획득하려는 시도가 포착됩니다.",
      "choices": [
        { "text": "실수를 인정하고, 해당 계정의 권한을 즉시 회수하고 다시 잠급니다.", "to": 28, "effects": { "sec": 1, "trust": -1, "downtime": 3 } },
        { "text": "모르는 척하며, 공격자의 최종 목표가 무엇인지 계속 지켜봅니다.", "to": 29, "effects": { "sec": -1, "avail": 1, "evid": 1 } }
      ]
    },
    {
      "id": 28, "text": "신속한 통제 덕분에 더 이상의 확산은 막았습니다. 하지만 일부 서비스 중단으로 인한 불만은 여전히 남아 있습니다.",
      "choices": [
        { "text": "현재 상황을 사내 채널에 공유하여 투명성을 확보합니다.", "to": 30, "requires": "tag:official_comms", "effects": { "trust": 1, "avail": 1, "downtime": 2 } },
        { "text": "팀장에게만 요약 보고를 올려 조용히 상황을 정리합니다.", "to": 30, "effects": { "trust": -1, "downtime": 1 } }
      ]
    },
    {
      "id": 29, "text": "조용히 넘어가려 했지만, 경보판에 아까 보았던 바로 그 외부 IP 주소가 다시 한번 나타납니다. 위협은 아직 사라지지 않았습니다.",
      "choices": [
        { "text": "해당 IP 주소를 즉시 차단하고, 시스템 전체에서 관련 흔적을 검색합니다.", "to": 30, "effects": { "sec": 1, "evid": 1, "downtime": 3 } },
        { "text": "문제의 지점만 임시방편으로 막아두고, 급한 복구 작업부터 진행합니다.", "to": 30, "effects": { "avail": 1, "sec": -1 } }
      ]
    },
    {
      "id": 30, "text": "길었던 밤의 끝이 보입니다. 이제 복구 순서를 확정하고, 새로운 보안 규칙을 배포하며, 이 모든 과정을 하나의 보고서로 엮어낼 차례입니다.",
      "choices": [
        { "text": "필수 기능부터 재개하고, 다음 정기 점검 시간을 약속하며 신뢰를 얻습니다.", "to": 31, "effects": { "avail": 1, "trust": 1, "downtime": 3 } },
        { "text": "지금 이 순간을 '정상'으로 선언합니다. 약간 성급한 판단일 수 있습니다.", "to": 31, "effects": { "trust": 1, "avail": 1, "sec": -1 } }
      ]
    },
    {
      "id": 31, "text": "마지막으로 백업 데이터를 점검합니다. 혹시 모를 데이터 암호화 공격의 흔적이 있는지 확인해야 합니다.",
      "choices": [
        { "text": "샘플 데이터를 직접 복원하여 데이터의 무결성을 직접 확인합니다.", "to": 32, "effects": { "sec": 1, "evid": 1, "downtime": 7, "avail": -1 } },
        { "text": "시간을 아끼기 위해 테스트를 생략하고, 이상이 없다고 보고합니다.", "to": 32, "effects": { "avail": 1, "downtime": -5, "sec": -2 } }
      ]
    },
    {
      "id": 32, "text": "사건의 증거들을 최종 정리합니다. 흩어져 있던 로그, 사진, 통화 기록을 하나의 타임라인으로 묶어냅니다.",
      "choices": [
        { "text": "모든 증거에 보관 이력을 명시하여 법적 효력을 갖춘 정식 자료로 보관합니다.", "to": 33, "effects": { "evid": 2, "sec": 1, "downtime": 4 } },
        { "text": "팀 공유 폴더에만 업로드하고 마무리합니다. (빠름)", "to": 33, "effects": { "evid": -1, "trust": -1, "downtime": -2 } }
      ]
    },
    {
      "id": 33, "text": "이제 사람과 절차에 대한 후속 조치가 남았습니다. 문제의 외주 업체, 내부 직원 교육, 그리고 기존의 허술했던 절차들이 당신의 결정을 기다립니다.",
      "choices": [
        { "text": "외주 업체에 공식 항의하고, 야간 작업 절차의 전면 개정을 공식 추진합니다.", "to": 34, "effects": { "trust": -1, "sec": 2, "downtime": 5 } },
        { "text": "담당 부서에 비공식적으로 전달하고, 조용히 넘어갑니다.", "to": 34, "effects": { "trust": 1, "sec": -2 } }
      ]
    },
    {
      "id": 34, "text": "최종 점검. 경보판은 조용하고, 새로 배포된 규칙은 시스템에 자리를 잡았습니다. 이제 길고 어두웠던 밤의 최종 결산을 내릴 시간입니다.",
      "choices": [
        { "text": "요약 보고를 마치고, 향후 유사 상황을 대비한 고객 공지 템플릿을 만들어 공유합니다.", "to": "END", "effects": { "evid": 1, "trust": 1, "avail": 1, "downtime": 3 } },
        { "text": "내부 보고서만 제출하고 조용히 밤을 마무리합니다.", "to": "END", "effects": { "trust": 0, "downtime": -3 } }
      ]
    },
    {
      "id": 90, "image": "boss_pressure_call.png", "text": "상사에게서 메시지가 왔습니다. “중단 시간이 너무 깁니다. 당장 재개할 수 있는 기능부터 복구하세요.” 그의 메시지에는 질책과 압박감이 섞여 있습니다.",
      "returns": true, "choices": [
        { "text": "가장 민원이 많은 핵심 기능부터 우선 재개하겠다고 보고합니다.", "to": "RETURN", "effects": { "avail": 2, "trust": 1, "downtime": -5 } },
        { "text": "아직 위협이 남아있어, 현재의 차단 조치가 불가피하다고 설명합니다.", "to": "RETURN", "effects": { "sec": 1, "avail": -1, "trust": -1, "downtime": 3 } }
      ]
    },
    {
      "id": 91, "image": "exfiltration_hint.png", "text": "외부로 향하는 데이터 전송량이 증가하고 있습니다. 작은 파일들이 계속해서 외부 서버로 빠져나가고 있습니다. 결단이 필요한 시점입니다.",
      "returns": true, "choices": [
        { "text": "지금 즉시 모든 외부 연결을 끊고, 관련 PC와 계정을 동결시킵니다.", "to": "RETURN", "effects": { "sec": 2, "avail": -1, "downtime": 4 } },
        { "text": "더 확실한 증거와 공격의 전모를 파악하기 위해, 위험을 감수하고 지켜봅니다.", "to": "RETURN", "effects": { "evid": 1, "sec": -1, "exfil_watch": 1 } }
      ]
    }
  ],
  "endings": [
    {
      "id": "A1", "name": "균형 잡힌 대응", "condition": "sec >= 3 && avail >= 0 && evid >= 4 && trust >= 1 && downtime <= 35",
      "summary": "완벽한 밤이었습니다. 당신은 침입을 효과적으로 막아냈고, 서비스 중단은 최소화했으며, 모든 과정을 설명할 수 있는 명확한 증거까지 확보했습니다. 동이 트는 창밖을 보며, 당신은 조용히 커피 한 잔을 내립니다. 어둠은 물러갔고, 당신은 그 중심에서 모든 것을 지켜냈습니다."
    },
    {
      "id": "S1_detective", "name": "탐정형 전문가", "condition": "evid >= 5 && sec <= 2 && sec >= 1 && trust >= 0",
      "summary": "사건은 끝났지만, 당신의 진짜 업무는 이제 시작입니다. 당신이 제출한 완벽한 분석 보고서는 단순한 사건 기록을 넘어, 적의 얼굴을 그려낸 지도가 되었습니다. 이제 회사는 방어하는 대신, 반격을 준비합니다. 당신은 그 전략의 핵심에 서게 될 것입니다."
    },
    {
      "id": "A2", "name": "안전했지만 값비싼 밤", "condition": "sec >= 4 && evid <= 4 && (avail <= -1 || downtime > 40)",
      "summary": "요새는 지켜냈지만, 성벽은 상처투성이입니다. 당신의 강경한 대응은 위협을 완벽히 차단했지만, 그 과정에서 동료들의 업무와 신뢰에 깊은 상처를 남겼습니다. 당신은 '유능하지만 함께 일하기 힘든 전문가'라는 잊기 힘든 평판을 얻었습니다."
    },
    {
      "id": "B_plus_pragmatist", "name": "현장형 해결사", "condition": "trust >= 2 && avail >= 1 && sec <= 0",
      "summary": "시스템은 빠르게 안정되었고, 동료들은 당신의 신속한 소통에 안도합니다. 하지만 조용한 서버실에는 당신만이 아는 작은 균열들이 남아있습니다. 당신은 급한 불은 껐지만, 불씨를 완전히 제거하지는 못했습니다. 평화로운 아침, 당신은 홀로 그 불안감을 마주합니다."
    },
    {
      "id": "B1", "name": "흔적이 남고 신뢰가 흔들린 밤", "condition": "!(A1||S1_detective||A2||B_plus_pragmatist||B2||C)",
      "summary": "사건은 일단락되었지만, 짙은 안개가 걷히지 않았습니다. 당신은 급한 불을 껐지만, '왜' 이런 일이 일어났는지에 대한 명확한 증거를 제시하지 못했습니다. 복도는 조용하지만, 당신의 판단력에 대한 의구심은 쉽게 사그라들지 않을 것입니다."
    },
    {
      "id": "B2", "name": "유출 의심의 밤", "condition": "sec <= -1 && exfil_confirmed == true",
      "summary": "어둠 속에서 무언가 빠져나갔습니다. 당신의 노력에도 불구하고, 시스템의 방벽은 뚫렸고, 중요한 데이터가 외부로 전송된 정황이 명백합니다. 이제 남은 것은 피해 규모를 산정하는 일뿐. 실패의 쓴맛이 새벽 공기보다 차갑게 느껴집니다."
    },
    {
      "id": "C", "name": "엉킨 밤", "condition": "avail <= -2 && trust <= -2",
      "summary": "최악의 밤이었습니다. 당신은 보안도, 서비스의 안정성도, 동료들의 신뢰도 모두 지켜내지 못했습니다. 당신의 결정들은 연쇄적으로 꼬여 상황을 악화시켰습니다. 동이 트는 것이 두렵게 느껴지는 새벽, 당신은 어지러운 책상 앞에 홀로 앉아 있습니다."
    }
  ]
}
export default gameData;