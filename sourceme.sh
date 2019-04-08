
if [ -d "$HOME/workspace/binary-stellar-system.github.io" ] ; then 
    export BINARY_STELLAR_SYSTEM_HOME=$HOME/workspace/binary-stellar-system.github.io/
else 
    if [ -d "$HOME/binary-stellar-system.github.io" ] ; then 
        export BINARY_STELLAR_SYSTEM_HOME=$HOME/binary-stellar-system.github.io/
    else 
        if [ -d "$HOME/sourcecode/binary-stellar-system.github.io" ] ; then 
            export BINARY_STELLAR_SYSTEM_HOME=$HOME/sourcecode/binary-stellar-system.github.io/
        fi 
    fi 
fi 
echo "BINARY_STELLAR_SYSTEM_HOME set to $BINARY_STELLAR_SYSTEM_HOME"

JAVA_EXEC=`which java`
ECJ_EXEC=`which ecj`
if [ -f "$JAVA_EXEC" ]; then 
    export JAVA_EXECUTABLE=$JAVA_EXEC
fi
echo "JAVA_EXECUTABLE set to $JAVA_EXECUTABLE"


