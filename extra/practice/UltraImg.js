let isSelectFile = true;
let uploadMapResult;

const onChangeFile = async (file) => {
  try {
    isSelectFile = false;
  } catch (error) {
    console.error(error);
  }
};

const onOpenMap = async () => {};
