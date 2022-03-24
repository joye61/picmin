import { getNewDimension } from "../renderer/workerc";

test("Dimension convert test", () => {
  const t1 = getNewDimension(
    {
      oldWidth: 100,
      oldHeight: 100,
    },
    {
      percent: 50,
      mode: "percent",
    }
  );
  const t2 = getNewDimension(
    {
      oldWidth: 115,
      oldHeight: 121,
    },
    {
      percent: 43.33,
      mode: "percent",
    }
  );

  const t3 = getNewDimension(
    {
      oldWidth: 100,
      oldHeight: 120,
    },
    {
      percent: 50,
      mode: "width",
      width: 40,
    }
  );

  const t4 = getNewDimension(
    {
      oldWidth: 100,
      oldHeight: 120,
    },
    {
      percent: 50,
      mode: "height",
      height: 40,
    }
  );

  const t5 = getNewDimension(
    {
      oldWidth: 100,
      oldHeight: 120,
    },
    {
      percent: 50,
      mode: "width",
    }
  );

  const t6 = getNewDimension(
    {
      oldWidth: 100,
      oldHeight: 120,
    },
    {
      percent: 50,
      mode: "height",
    }
  );

  // 确保小边的宽度大于1
  const t7 = getNewDimension(
    {
      oldWidth: 100,
      oldHeight: 120,
    },
    {
      percent: 50,
      mode: "height",
      height: 1
    }
  );



  expect(t1).toEqual({ width: 100 / 2, height: 100 / 2 });

  expect(t2.width.toFixed(4)).toBe(((115 * 43.33) / 100).toFixed(4));
  expect(t2.height.toFixed(4)).toBe(((121 * 43.33) / 100).toFixed(4));

  expect(t3.width).toBe(40);
  expect(t3.height.toFixed(4)).toEqual((120 / (100 / 40)).toFixed(4));

  expect(t4.height).toBe(40);
  expect(t4.width.toFixed(4)).toEqual((100 / (120 / 40)).toFixed(4));

  expect(t5).toEqual({
    width: 100,
    height: 120,
  })

  expect(t6).toEqual({
    width: 100,
    height: 120,
  })

  expect(t7.width).toBe(1);
});
