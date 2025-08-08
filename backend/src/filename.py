def id_to_filename(replay_id: int):
    n = replay_id % 1679616  # zzzzを超えると0から数え直し
    returining = ""
    for i in range(3):
        digit = n % 36
        n //= 36
        returining = int_to_str(digit) + returining
    returining = int_to_str(n % 36) + returining
    return returining


def int_to_str(number: int):
    if number < 10:
        return str(number)

    unicode_point_a = ord("a")
    return chr(unicode_point_a + (number - 10))
