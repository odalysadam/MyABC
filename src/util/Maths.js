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
   * Calculates length of vector
   *
   * @param {number[]} v - array representing a vector in 2D
   * @returns {number} length of given vector
   */
  static length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  }

  /**
   * Calculates distance between two points
   *
   * @param {number[]} p0 - array representing a point in 2D
   * @param {number[]} p1 - array representing a point in 2D
   * @returns {number} distance of p0 and p1
   */
  static distance(p0, p1) {
    return Math.sqrt((p0[0] - p1[0]) * (p0[0] - p1[0]) + (p0[1] - p1[1]) * (p0[1] - p1[1]))
  }

  /**
   * Tests if given vectors are equal.
   * Vectors are equal, if their x and y values are equal.
   *
   * @param {number[]} v0 - array representing a vector in 2D
   * @param {number[]} v1 - array representing a vector in 2D
   * @returns {boolean} true, if x value and y value of vectors are equal
   */
  static equals(v0, v1) {
    return v0[0] === v1[0] && v0[1] === v1[1]
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

    if (t < -0.075 || t > 1.075) return null

    return Maths.add(p0, Maths.mult(direction, t))
  }

  /**
   * Calculates angle between two vectors in degree.
   * Used for rotations and validation of direction.
   *
   * @param {number[]} v0 - array representing a vector in 2D
   * @param {number[]} v1 - array representing a vector in 2D
   * @returns {number} angle between two vectors in degree
   */
  static calcAngleBetweenVectors(v0, v1) {
    const s = Maths.dot(v0, v1)
    const cos = s / (Maths.length(v0) * Maths.length(v1))
    const a = Maths.radToDeg(Math.acos(cos))

    return a
  }

  /**
   * Converts an angle from radians to degree.
   * Origin of formula:
   * http://cwestblog.com/2012/11/12/javascript-degree-and-radian-conversion/, 27.05.2018
   *
   * @param {number} rad - angle in radians
   * @returns {number} angle in degree
   */
  static radToDeg(rad) {
    return rad * 180 / Math.PI
  }

  /**
   * Translates parametric functions into an array of points.
   *
   * @param {string} xt - parametric function x(t)
   * @param {string} yt - parametric function y(t)
   * @param {number} tMin - minimum value for t
   * @param {number} tMax - maximum value for t
   * @param {number} [segments=50] - number of segments the curve should be split into
   * @returns {Array.<number[]>} array of two-dimensional points
   */
  static funcToPoints(xt, yt, tMin, tMax, segments = 50) {
    eval('evalCurve = t => { return [' +
      xt + ', ' + yt + '] }')

    let points = []
    for (let i = 0; i <= segments; i++) {
      const t = tMin + (i / segments) * (tMax - tMin)
      const p = evalCurve(t)
      points.push(p)
    }
    return points
  }
}
