# 목차
1. [ListCheckr 프로젝트 개요](#Catchmind-프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [기능](#기능)
4. [아키텍처](#아키텍처)
5. [고도화](#고도화)
6. [💡 느낀점 및 개선점](#-느낀점-및-개선점)
7. [Micro Service Link](#-Micro-Service-Link)

<br/><br/>

# ListCheckr 프로젝트 개요
    - 목표 : task tool에 익숙하지 않은 업종의 종사자들도 손쉽게 이용 가능한 업무 공유 웹 서비스 구축
    - 핵심 가치 :
        - 기능 및 사용방법의 간소화로 사용자들의 접근성 향상
        - 비용 부담 없이 업무 협업을 위한 웹 서비스 제공

<br/>

# 기술 스택
- ### Front-end
  React.js
- ### Back-end
  Node.js / SpringBoot
- ### Database
  MongoDB / PostgreSQL / Redis
- ### 그 외 스택
  Docker, Kafka, Jenkins

<br/>

# 기능
- ### 회원가입, 로그인, 채팅, 태스크툴

- ### 태스크툴
  ##### 각 보드마다 멤버를 초대하여 공동 작업이 가능합니다.
  ![todo](https://github.com/jonghechoi/ListCheckr/assets/57426066/b5c01205-921f-48d7-b796-5e7b4dd71b47)

- ### 채팅
  ##### 해당 보드의 멤버들 간에 실시간 채팅 기능을 사용할 수 있습니다.
  ![chat](https://github.com/jonghechoi/ListCheckr/assets/57426066/28db8149-7674-439d-b9ce-20b14cc54d33)

<br/>

# 아키텍처
Domian Driven Design 설계를 기반으로 총 5개의 도메인(회원 관리, 로그인, task, 결제, 채팅)을 도출했습니다. → [링크](https://jonghe.notion.site/a6c069b0f88e47daa54b16ec47a68c14?pvs=4) <br/>
각 도메인은 마이크로서비스 애플리케이션으로 구성됩니다.

- ## 인프라
  ### local
  #### 로컬에서는 각 애플리케이션 별 개발과 단위테스트를 할 수 있습니다. 통합테스트가 필요한 부분에서는 카프카를 이용해 데이터를 공유하며 진행했습니다.
  ![Infra_Local](https://github.com/jonghechoi/ListCheckr/assets/57426066/cf91f4f5-db37-438b-a29e-7b96c2cbf00b)
  ### dev
  #### 모든 애플리케이션은 도커 파일로 빌드(CI 파이프라인 사용하자. Github Actions or Jenkins)되고 도커 컴포즈로 한번에 조작될 수 있도록 구성했습니다.
  ![Infra_Dev](https://github.com/jonghechoi/ListCheckr/assets/57426066/6a6400f0-dc4e-4d3f-a3d4-18631ea75c39)

- ## 애플리케이션
  ![Application_Architecture](https://github.com/jonghechoi/ListCheckr/assets/57426066/79c1f498-1c4d-440d-8895-f3aec414bc24)

<br/>

# 고도화
- CI/CD <br/>
  Jenkins로 파이프라인을 구성했습니다. → [링크](https://github.com/jonghechoi/ListCheckr_member/blob/master/Jenkinsfile) <br/>
  각 애플리케이션의 레포지토리 master브랜치에 커밋이 발생하면 자동으로 dev 환경에 있는 애플리케이션이 업데이트됩니다.
- AOP <br/>
  Logging, Exception 처리
- TDD

<br/>

# 💡 느낀점 및 개선점
- ### 느낀점
  애자일 방법론, 익숙하지 않은 언어와 기술들을 사용하여 만든 프로젝트입니다.
  열정과 노력이 많이 들어간 프로젝트이다 보니 리팩토링을 통해 지속적인 개선점 보완하고자 합니다.
- ### 개선점
  1. DB의 read/write 측면을 고려하여 읽기전용 복제본을 만들 필요는 없는지 고민이 필요합니다.
  2. AWS 배포시 Beanstalk 혹은 컨테이너로 올린다면 EKS 사용을 고려해 볼 수 있습니다.
  3. HTTPS 적용
  4. 사용자 입장에서 UX 개선이 필요합니다.
  5. 반응형웹으로 업데이트가 필요합니다.

<br/>

# Micro Service Link

taskService : https://github.com/jhoh416/ListCheckr_task

memberService : https://github.com/jonghechoi/ListCheckr_member

gatewayService : https://github.com/jonghechoi/ListCheckr_netflix-eureka

discoveryService : https://github.com/jonghechoi/ListCheckr_api-gateway

chatService : https://github.com/jonghechoi/ListCheckr_chat

authService : https://github.com/jonghechoi/ListCheckr_auth
