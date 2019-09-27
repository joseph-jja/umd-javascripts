const baseDir = process.cwd(),
    {
        getNumberWidth,
        getNumberHeight,
        getSegmentHeight,
        setMatrixPoint,
        clearScreen,
        clearMatrix,
        writeMatrix
    } = require(`${baseDir}/src/server/terminal/matrix`);

const numberWidth = getNumberWidth(),
    numberHeight = getNumberHeight(),
    segmentHeight = getSegmentHeight();

 function getIndexOffset(cols) {
   const idx = ((cols - 1) * numberWidth);
   if (cols === 3 ) {
       return ((cols - 1) * numberWidth) + 4;
   } else if (cols === 4 ) {
     return ((cols - 1) * numberWidth) + 4;
   }
   return ((cols - 1) * numberWidth);
}

function horizontalSegment(row, colStart) {

    const idx = getIndexOffset(colStart);
    const offset = (colStart === 1 ? 2 : (2 * colStart));
    let rowSet = (row === 1 ? row + 1 : ((row - 1) * (segmentHeight - 1)));
    if (row === 3) {
        rowSet -= 2;
    }
    for (let i = 0; i < numberWidth; i++) {
        setMatrixPoint(rowSet, idx + i + offset, '*');
    }
}

function verticleSegment(rowStart, col, startEnd = 0) {

    const idx = getIndexOffset(col);
    let offset = (col === 1 ? 2 : (2 * col));
    offset = (startEnd === 0 ? offset : offset + numberWidth - 1);
    const rowSet = (rowStart === 1 ? rowStart + 1 : ((rowStart - 1) * (segmentHeight - 1))) - 1;
    for (let i = 1; i < segmentHeight - 1; i++) {
        setMatrixPoint(rowSet + i, idx + offset, '*');
    }
}

module.exports = {
    horizontalSegment,
    verticleSegment
};