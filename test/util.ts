import { assertEquals, replaceParams, test } from "../deps.ts";

test(function testReplaceDate() {
  const date = new Date("2019-01-01 12:12:12");
  assertEquals(replaceParams("?", [date]), `"2019-01-01 12:12:12"`);
  assertEquals(
    replaceParams("?", [new Date(1551244259181)]),
    `"2019-02-27 13:10:59"`
  );
});

test(function testIdReplace() {
  assertEquals(
    replaceParams(`'??' "??" ?? ?`, ["a", "b"]),
    `'??' "??" \`a\` "b"`
  );

  assertEquals(replaceParams("?? ?", null), "?? ?");
  assertEquals(replaceParams("?? ?", []), "?? ?");
  assertEquals(replaceParams("?? ?", [null, null]), "`` NULL");

  assertEquals(replaceParams("??", ["user.id"]), "`user`.`id`");
  assertEquals(replaceParams("??", ["user.*"]), "`user`.*");
  assertEquals(
    replaceParams("??", ["user.id as user_id"]),
    "`user`.`id` AS `user_id`"
  );

  assertEquals(replaceParams("?? ?", ["id", "val"]), '`id` "val"');
  assertEquals(replaceParams("??", ["id"]), "`id`");
  assertEquals(replaceParams("??", [1]), "`1`");
  assertEquals(replaceParams("??", [true]), "`true`");
  assertEquals(replaceParams("?", ["string"]), `"string"`);
  assertEquals(replaceParams("?", [123]), `123`);
  assertEquals(replaceParams("?", [`"test"`]), '"\\"test\\""');
  assertEquals(replaceParams("?", [["a", "b", "c", "d"]]), '("a","b","c","d")');
  assertEquals(replaceParams("?", [[1, 2, 3, 4]]), "(1,2,3,4)");
  assertEquals(replaceParams("??", [["a", "b", "c"]]), "(`a`,`b`,`c`)");

  let keys: string[] = ["a", "b", "c"];
  assertEquals(replaceParams("??", [keys]), "(`a`,`b`,`c`)");
  assertEquals(
    replaceParams("??", [Object.keys({ a: 1, b: 1, c: 1 })]),
    "(`a`,`b`,`c`)"
  );

  const query = replaceParams(
    `select ??, ?? from ?? where ?? = ? and ?? = ? and is_admin = ?`,
    ["name", "email", "users", "id", 1, "name", "manyuanrong", true]
  );
  assertEquals(
    query,
    'select `name`, `email` from `users` where `id` = 1 and `name` = "manyuanrong" and is_admin = true'
  );
});
