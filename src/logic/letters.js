/**
 * Stores the definition of how the letters are build. Exports a dictionary
 * with the letters name as key. A letter is defined by an array of sections.
 * A section is an array of subsection. A subsection is an object with
 * type and def as keys. The type determines if the subsection is a
 * line or a curve, while def stores the actual definition of the letter.
 * For lines it's an array of two two-dimensional points represented by an
 * array. Curves are defined through two parametrical functions with a minimum
 * and maximum t.
 */

/**
 * Constant Object storing the type options.
 */
const TYPE = Object.freeze({
  LINE: 'LINE',
  CURVE: 'CURVE'
})

/**
 * Dictionary of letter definitions.
 * Stores the big a and the small p for now
 */
export default letters = {
  a_big: [

    /** first section */
    [
      /** first subsection - left line of the A bottom to top: ->A */
      {
        type: TYPE.LINE,
        visibleEnds: true,
        def: [
          [60, 350],
          [165, 95]
        ],
      },
      /** second subsection - right line of the A top to bottom: A<- */
      {
        type: TYPE.LINE,
        visibleEnds: true,
        def:[
          [165, 95],
          [260, 350]
        ]
      }
    ],
    /** second section */
    [
      /** first subsection - horizontal middle line of the A left to right*/
      {
        type: TYPE.LINE,
        visibleEnds: false,
        def: [
          [97, 240],
          [227, 240]
        ]
      }
    ]
  ],
  p_small: [
    /** first section */
    [
      /** first subsection - vertical line top to bottom of the p*/
      {
        type: TYPE.LINE,
        visibleEnds: true,
        def: [
          [120, 90],
          [120, 350]
        ],
      },
    ],
    /** second section */
    [
      /** first subsection - vertical line bottom to top (same line but shorter) */
      {
        type: TYPE.LINE,
        visibleEnds: false,
        def: [
          [120, 350],
          [120, 115]
        ]
      },
      /** second subsection - curve of the p top to bottom clockwise */
      {
        type: TYPE.CURVE,
        visibleEnds: false,
        def: {
          xt: '165 + 55 * -Math.cos(t * Math.PI)',  // circle function with center at x pos 165 and radius 55
          yt: '155 + 55 * -Math.sin(t * Math.PI)',  // circle function with center at y pos 155 and radius 55
          tMin: 0.175,  // 0 would be a full circle
          tMax: 1.825   // 2 would be a full circle
        }
      }
    ]
  ]
}