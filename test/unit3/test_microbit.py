import unittest
import microbit

class MicrobitTestCase(unittest.TestCase):
    def test_image_builtin(self):
        self.assertEqual(str(microbit.Image.HEART), "09090:99999:99999:09990:00900")
        self.assertEqual(microbit.Image.HEART.get_pixel(2, 0), 0)
        self.assertEqual(microbit.Image.HEART.get_pixel(1, 0), 9)

    def test_image_from_string(self):
        img = microbit.Image("12345:00000:00000:00000:54321")
        self.assertEqual(img.get_pixel(0, 0), 1)
        self.assertEqual(img.get_pixel(4, 4), 1)
        img.set_pixel(0, 0, 9)
        self.assertEqual(img.get_pixel(0, 0), 9)

    def test_display_show_image(self):
        microbit.display.clear()
        microbit.display.show(microbit.Image.YES)
        self.assertEqual(microbit.last_call(), "show")
        self.assertEqual(microbit.display.get_pixel(4, 1), 9)

    def test_display_show_string_sequence(self):
        microbit.display.clear()
        t0 = microbit.running_time()
        microbit.display.show("AB", delay=50)
        # Multi-char: sleep after every frame including the last.
        self.assertGreaterEqual(microbit.running_time(), t0 + 100)
        # Final frame is 'B' (mock fingerprint: code % 10 in [0][0]).
        self.assertEqual(microbit.display.get_pixel(0, 0), ord("B") % 10)
        self.assertEqual(microbit.display.get_pixel(2, 2), 9)

    def test_display_show_single_char_no_delay(self):
        microbit.display.clear()
        t0 = microbit.running_time()
        microbit.display.show("A", delay=50)
        self.assertEqual(microbit.running_time(), t0)
        self.assertEqual(microbit.display.get_pixel(0, 0), ord("A") % 10)

    def test_display_show_string_not_image_pattern(self):
        # Multi-char strings are shown glyph-by-glyph, not parsed as Image patterns.
        microbit.display.clear()
        pattern = "12345:00000:00000:00000:54321"
        microbit.display.show(pattern, delay=0)
        self.assertEqual(microbit.display.get_pixel(0, 0), ord(pattern[-1]) % 10)
        self.assertEqual(microbit.display.get_pixel(2, 2), 9)

    def test_display_show_empty_string_noop(self):
        microbit.display.clear()
        microbit.display.set_pixel(0, 0, 5)
        microbit.display.show("")
        self.assertEqual(microbit.display.get_pixel(0, 0), 5)

    def test_display_set_get_clear(self):
        microbit.display.clear()
        microbit.display.set_pixel(2, 3, 7)
        self.assertEqual(microbit.display.get_pixel(2, 3), 7)
        microbit.display.clear()
        self.assertEqual(microbit.display.get_pixel(2, 3), 0)

    def test_buttons(self):
        self.assertFalse(microbit.button_a.is_pressed())
        self.assertFalse(microbit.button_a.was_pressed())
        self.assertEqual(microbit.button_a.get_presses(), 0)

    def test_running_time_and_sleep(self):
        t0 = microbit.running_time()
        microbit.sleep(10)
        self.assertGreaterEqual(microbit.running_time(), t0 + 10)

if __name__ == '__main__':
    unittest.main()
