function setup() {
    return {
        input: ["B08", "dataMask"],
        output: {
            bands: 3,
            sampleType: "INT16"
        },
        mosaicking: "ORBIT"
    };
}

function evaluatePixel(samples, scene) {
    const dates = scenes.orbits.map(scene => scene.dateFrom);
    const y = samples.map(sample => sample.B08);
    const n = y.length
    let intersect = new Array(n); for (let i = 0; i < n; ++i) intersect[i] = 1;
    const X = [
        intersect,
        Array(n).fill(1).map((x, y) => x + y)
    ]
    const beta = lstsq(X, y)
    return beta
}

function dateToDecimalDate(date) {
    // Takes a UTM date object and returns doy divided by lenght of year in days
    // i.e. 0 for first of january, 1 for midnight at 12
    const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    const end = new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 0));
    const diffYear = end - start;
    return (date - start) / diffYear
}

function lstsq(X, y) {
    const Xt = transpose(X)
    const Xdot = matrixDot(X, Xt)
    const XTX = inv(Xdot)
    const XTY = vectorMatrixMul(X, y)
    return vectorMatrixMul(XTX, XTY)
}

dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);

function transpose(a) {
    return a[0].map((_, colIndex) => a.map(row => row[colIndex]));
}

//The chosen one
function matrixDot(A, B) {
    var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
        return row.map((val, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0)
        })
    })
}

function vectorMatrixMul(A, B) {
    let result_len = A.length
    let result = new Array(result_len).fill(0);
    for (let i = 0; i < B.length; i++) {
        for (let j = 0; j < result_len; j++) {
            result[j] += A[j][i] * B[i]
        }
    }
    return result
}

// Returns the inverse of matrix `_A`.
// taken from here: https://gist.github.com/husa/5652439
function inv(_A) {
    var temp,
        N = _A.length,
        E = [];

    for (var i = 0; i < N; i++)
        E[i] = [];

    for (i = 0; i < N; i++)
        for (var j = 0; j < N; j++) {
            E[i][j] = 0;
            if (i == j)
                E[i][j] = 1;
        }

    for (var k = 0; k < N; k++) {
        temp = _A[k][k];

        for (var j = 0; j < N; j++) {
            _A[k][j] /= temp;
            E[k][j] /= temp;
        }

        for (var i = k + 1; i < N; i++) {
            temp = _A[i][k];

            for (var j = 0; j < N; j++) {
                _A[i][j] -= _A[k][j] * temp;
                E[i][j] -= E[k][j] * temp;
            }
        }
    }

    for (var k = N - 1; k > 0; k--) {
        for (var i = k - 1; i >= 0; i--) {
            temp = _A[i][k];

            for (var j = 0; j < N; j++) {
                _A[i][j] -= _A[k][j] * temp;
                E[i][j] -= E[k][j] * temp;
            }
        }
    }

    for (var i = 0; i < N; i++)
        for (var j = 0; j < N; j++)
            _A[i][j] = E[i][j];
    return _A;
}

