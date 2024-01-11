# Feed for School

- [API Documentation]()
- [Demo URL]()

## 프로젝트

학교 소식 뉴스피드 시스템입니다. 이런 기능이 갖춰져 있습니다.

- 학교 관리자
  - 학교 페이지의 생성
  - 학교 소식 작성, 수정, 삭제
- 학생

  - 학교 페이지 구독 @Post('/:userId/following/:schoolId')
  - 구독중인 학교 페이지 확인 @Get('/:userId/following') TODO-sort
  - 구독중인 학교 페이지 구독 취소 @Delete('/:userId/following/:schoolId')
  - 구독중인 학교 페이지별 소식 TODO -> @Get('/:schoolId/news')
  - 구독중인 전체 학교 뉴스피드 @Get('/:userId/newsfeed')

### 뉴스피드 시스템 설명

### 고려한 포인트

..

### 스택

- nest.js
- mongoDB
- Redis

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

## Contact

황유덕 - yooduck.h@gmail.com

이력서 링크 - [bit.ly/yooduck_hwang_resume](bit.ly/yooduck_hwang_resume)
