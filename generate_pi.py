from mpmath import mp
mp.dps = 1000050
pi_str = mp.nstr(mp.pi, 1000010, strip_zeros=False)
decimal_idx = pi_str.index('.')
digits = pi_str[decimal_idx+1:][:1000000]
assert len(digits) == 1000000, f"Only got {len(digits)} digits"
assert digits.isdigit(), "Non-digit characters found"
with open('public/pi-million.txt', 'w') as f:
    f.write(digits)
print(f"Written {len(digits)} digits. First 20: {digits[:20]}")
