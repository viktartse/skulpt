import unittest
import robot

class RobotTestCase(unittest.TestCase):
    def test_move(self):
        robot.speed(10)
        
        robot.move_right()
        self.assertEqual("move_right", robot.last_call())

        robot.move_left()
        self.assertEqual("move_left", robot.last_call())

        robot.move_up()
        self.assertEqual("move_up", robot.last_call())

        robot.move_down()
        self.assertEqual("move_down", robot.last_call())
        
        robot.mr()
        self.assertEqual("move_right", robot.last_call())

        robot.ml()
        self.assertEqual("move_left", robot.last_call())

        robot.mu()
        self.assertEqual("move_up", robot.last_call())

        robot.md()
        self.assertEqual("move_down", robot.last_call())
        
    def test_paint(self):
        robot.speed(10)
        
        robot.paint()
        self.assertEqual("paint", robot.last_call())

        res_painted = robot.is_cell_painted()
        self.assertEqual("isCellPainted", robot.last_call())
        self.assertTrue(res_painted)

        res_not_painted = robot.is_cell_not_painted()
        self.assertEqual("isCellPainted", robot.last_call())
        
        self.assertEqual(res_painted, not res_not_painted)
        
        res_iscp = robot.iscp()
        self.assertEqual("isCellPainted", robot.last_call())

        res_iscnp = robot.iscnp()
        self.assertEqual("isCellPainted", robot.last_call())
        
        self.assertEqual(res_iscp, not res_iscnp)
        
    def test_wall(self):
        robot.speed(10)
        
        res = robot.is_wall_right()
        self.assertEqual("isWallFrom_right", robot.last_call())
        self.assertTrue(res)
        
        res = robot.is_wall_left()
        self.assertEqual("isWallFrom_left", robot.last_call())
        self.assertTrue(res)

        res = robot.is_wall_up()
        self.assertEqual("isWallFrom_up", robot.last_call())
        self.assertTrue(res)

        res = robot.is_wall_down()
        self.assertEqual("isWallFrom_down", robot.last_call())
        self.assertTrue(res)
        
        res = robot.iswr()
        self.assertEqual("isWallFrom_right", robot.last_call())
        self.assertTrue(res)
        
        res = robot.iswl()
        self.assertEqual("isWallFrom_left", robot.last_call())
        self.assertTrue(res)

        res = robot.iswu()
        self.assertEqual("isWallFrom_up", robot.last_call())
        self.assertTrue(res)

        res = robot.iswd()
        self.assertEqual("isWallFrom_down", robot.last_call())
        self.assertTrue(res)

    def test_free(self):
        robot.speed(10)
        
        res = robot.is_free_right()
        self.assertEqual("isFreeFrom_right", robot.last_call())
        self.assertTrue(res)
        
        res = robot.is_free_left()
        self.assertEqual("isFreeFrom_left", robot.last_call())
        self.assertTrue(res)

        res = robot.is_free_up()
        self.assertEqual("isFreeFrom_up", robot.last_call())
        self.assertTrue(res)

        res = robot.is_free_down()
        self.assertEqual("isFreeFrom_down", robot.last_call())
        self.assertTrue(res)
        
        res = robot.isfr()
        self.assertEqual("isFreeFrom_right", robot.last_call())
        self.assertTrue(res)
        
        res = robot.isfl()
        self.assertEqual("isFreeFrom_left", robot.last_call())
        self.assertTrue(res)

        res = robot.isfu()
        self.assertEqual("isFreeFrom_up", robot.last_call())
        self.assertTrue(res)

        res = robot.isfd()
        self.assertEqual("isFreeFrom_down", robot.last_call())
        self.assertTrue(res)

    def test_pollution(self):
        robot.speed(10)
        
        res = robot.pollution()
        self.assertEqual("getPollutionLevel", robot.last_call())
        self.assertEqual(1, res)
        
        res = robot.pol()
        self.assertEqual("getPollutionLevel", robot.last_call())
        self.assertEqual(1, res)
        
    def test_print_number(self):
        robot.speed(10)
        
        robot.print_number(10)
        self.assertEqual("printNumber_10", robot.last_call())
        
        res = robot.printn(10)
        self.assertEqual("printNumber_10", robot.last_call())

if __name__ == '__main__':
    unittest.main()