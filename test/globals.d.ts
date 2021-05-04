declare namespace NodeJS {
  interface Global {
    // Reference: https://stackoverflow.com/a/51114250
    testRequest: import('supertest').SuperTest<import('supertest').Test>
  }
}