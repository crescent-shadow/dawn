export const customMatchers = {
  toBeJQuery: function (): jasmine.CustomMatcher {
    return {
      compare: function (actual): jasmine.CustomMatcherResult {
        let result: jasmine.CustomMatcherResult = {
          pass: false
        };

        result.pass = !!actual.jquery;
        result.message = result.pass ?
          '' : `Expected ${typeof actual} to be a jQuery Object`;

        return result;
      }
    };
  }
};