export function getOffsetMatrix(matrixA, matrixB) {
    const m = matrixA.clone().invert().multiply(matrixB);
    return m;
}