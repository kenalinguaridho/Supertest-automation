// run-tests.js
const { runCLI } = require('jest');

async function runTestsInOrder() {
  const orderedTests = [
    '__test__/user/register.test.js',
    '__test__/user/activateAccount.test.js',
    '__test__/user/login.test.js',
    '__test__/user/getUser.test.js',
    '__test__/user/updateUser.test.js',
    '__test__/user/uploadAvatar.test.js',
    '__test__/user/deleteUser.test.js'
  ];

  const { results } = await runCLI({
    runInBand: true, // jalankan serial (tidak paralel)
    silent: false,   // tampilkan log
    config: './jest.config.js',
    _: orderedTests  // ini adalah argumen file test yang akan dijalankan urut
  }, [process.cwd()]);

  process.exit(results.success ? 0 : 1);
}

runTestsInOrder();
