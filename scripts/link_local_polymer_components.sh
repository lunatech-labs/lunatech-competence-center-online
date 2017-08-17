set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRCDIR=$DIR/../polymer-components
TARGETDIR=$DIR/../frontend

mkdir -p $TARGETDIR

cd $SRCDIR
for DIR in `ls -d *`
do
  cd $DIR;
  bower link
  cd $TARGETDIR
  bower link $DIR
  cd $SRCDIR
done
