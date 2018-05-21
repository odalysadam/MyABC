const TYPE = Object.freeze({
  LINE: 'LINE',
  CURVE: 'CURVE'
})

export default letters = {
  a_big: [
    [
      {
        type: TYPE.LINE,
        def: [
          [60, 350],
          [160, 100]
        ],
      },
      {
        type: TYPE.LINE,
        def:[
          [160, 100],
          [260, 350]
        ]
      }
    ],
    [
      {
        type: TYPE.LINE,
        def: [
          [105, 240],
          [215, 240]
        ]
      }
    ]
  ],
  p_small: [
    [
      {
        type: TYPE.LINE,
        def: [
          [120, 100],
          [120, 350]
        ],
      },
    ],
    [
      {
        type: TYPE.LINE,
        def: [
          [120, 350],
          [120, 125]
        ]
      },
      {
        type: TYPE.CURVE,
        def: {
          xt: '168 + 55 * -Math.cos(t * Math.PI)',
          yt: '160 + 55 * -Math.sin(t * Math.PI)',
          tMin: 0.2,
          tMax: 1.8
        }
      }
    ]
  ]
}