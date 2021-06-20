BACKEND_DIR=${PWD}
cd ${BACKEND_DIR}

git checkout production
git pull origin production

rm -f target/universal/backend-1.0.zip
rm -f -R target/universal/backend-1.0
sbt dist
unzip target/universal/backend-1.0.zip -d target/universal
./target/universal/backend-1.0/bin/backend
