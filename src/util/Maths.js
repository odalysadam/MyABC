export default class Maths {

  /**
   * Adds v0 and v1 creating a new vector
   *
   * @param {number[]} v0 - array representing a vector in 2D
   * @param {number[]} v1 - array representing a vector in 2D
   * @returns {number[]} new array representing a vector in 2D
   */
  static add(v0, v1) {
    return [v0[0] + v1[0], v0[1] + v1[1]]
  }

  /**
   * Subtracts v1 from v0 creating a new vector
   *
   * @param {number[]} v0 - array representing a vector in 2D
   * @param {number[]} v1 - array representing a vector in 2D
   * @returns {number[]} new array representing a vector in 2D
   */
  static sub(v0, v1) {
    return [v0[0] - v1[0], v0[1] - v1[1]]
  }

  /**
   * Calculates scalar product of two vectors in 2D
   *
   * @param {number[]} v0 - array representing a vector in 2D
   * @param {number[]} v1 - array representing a vector in 2D
   * @returns {number} scalar product of two vectors
   */
  static dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1]
  }

  /**
   * Multiplies vector with scalar
   *
   * @param {number[]} v - array representing a vector in 2D
   * @param {number} s - array representing a vector in 2D
   * @returns {number[]} new array representing a vector in 2D
   */
  static mult(v, s) {
    return [v[0] * s, v[1] * s]
  }

  /**
   * Calculates distance between two points
   *
   * @param {number[]} p0 - array representing a point in 2D
   * @param {number[]} p1 - array representing a point in 2D
   * @returns {number} distance of p0 and p1
   */
  static distance(p0, p1) {
    return Math.sqrt((p0[0] - p1[0]) * (p0[0] - p1[0]) * (p0[1] - p1[1]) * (p0[1] - p1[1]))
  }

  /**
   * Calculates distance from point to line
   *
   * @param {number[]} p - array representing a point in 2D
   * @param {number[]} p0 - array representing a point on a line in 2D
   * @param {number[]} p1 - array representing a point on a line in 2D
   * @returns {number[]} new array representing nearest point to p on line p0p1 in 2D
   */
  static nearestPointOnLine(p, p0, p1) {

    // get direction of line
    const direction = Maths.sub(p1, p0)

    // scalar parameter of nearest point
    const t = Maths.dot(Maths.sub(p, p0), direction) / Maths.dot(direction, direction)

    return Maths.add(p0, Maths.mult(direction, t))
  }
}