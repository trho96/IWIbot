#include <emscripten.h>
#include <stdio.h>

int EMSCRIPTEN_KEEPALIVE fibonacci(int n) {
  printf("%d", n);
  if (n == 0 || n == 1) {
    return n;
  } else {
    return (fibonacci(n - 1) + fibonacci(n - 2));
  }
}
