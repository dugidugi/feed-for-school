# Feed for School

- [Postman API Documentation](https://www.postman.com/security-geologist-25974434/workspace/my-workspace/collection/27787806-59307bb3-8362-403f-8b40-14c7ed212162)
- Demo API URL : https://feed-for-school-740b705af3ae.herokuapp.com

## 프로젝트

학교 소식 뉴스피드 시스템입니다. 아래 기능이 구현되어 있습니다.

- 학교 관리자
  - 학교 페이지의 생성
  - 학교 소식 작성
  - 학교 소식 수정
  - 학교 소식 삭제
- 학생
  - 학교 페이지 구독하기
  - 구독중인 학교 페이지 조회
  - 구독중인 학교 페이지 구독 취소
  - 구독중인 학교 페이지별 소식 조회
  - 구독중인 전체 학교 뉴스피드 조회

## 시작하기

### Prerequisites

- npm
  ```sh
  npm install
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. npm start
   ```js
   npm start
   ```

### Test

- e2e Test
  ```sh
  npm run test:e2e
  ```

## 뉴스피드 시스템 설명

Nest.js, MongoDB, Redis 로 구성된 피드 시스템입니다.

### 고려 사항

1. 사용자, 피드 게시물이 시간이 지남에 따라 많은 데이터양이 저장될 것이고, 이에 따른 확장성을 고려해야합니다.

   👉 NoSQL 기반의 DB 선택

2. 사용자별 뉴스피드는 또한 시간이 갈수록 많은 양이 쌓이게 됩니다. 유저에게 빠르게 뉴스피드를 제공할 수 있어야합니다. 이는 유저 경험에도 중요합니다.

   👉 사용자별 뉴스피드는 유저에게 빠른 피드를 제공하기위해 필요하기에 Redis 기반의 Push 시스템을 채택했습니다. (영속성 설정 필요)

3. 개별 게시물을 빠르게 조회할 수 있어야 합니다.

   👉 Redis를 활용하여 캐시를 적용했습니다.

\*위 스택이 익숙하지 않지만, 클래스팅의 개발 스택이라는 점, 피드DB로 NoSQL이 더 적합하다는 판단하에 과제를 진행했습니다.

---

### TO DO

작업 시간이 부족해서 미처 넣지 못한 기능들입니다.

- [ ] User, Admin Auth
- [ ] User, Admin Guard

## Contact

황유덕 - yooduck.h@gmail.com

이력서 링크 - [bit.ly/yooduck_hwang_resume](bit.ly/yooduck_hwang_resume)
