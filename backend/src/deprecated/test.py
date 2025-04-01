def for_loop(gen):
    # try:
    #     element = next(gen)
    #     while True:
    #         print(element)
    #         yield element
    #         element = next(gen)
    # except StopIteration:
    #     return
    yield 1
    yield 2
    yield 3
    yield 4
    # yield from gen()


for i in range(5):
    print(i)

for i in for_loop(range(5)):
    print(i)
