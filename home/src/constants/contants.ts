class Constants {
  private imagePath: any
  private static instance: Constants;
  private constructor(){
    const path = "/nfs/home/rocha/Documents/projects/pessoal/felipefrocha.github.io/home/src/images"
    this.setImagePath(path || '')
  }
  public static getInstance(): Constants {
    if (!Constants.instance) {
      Constants.instance = new Constants();
    }

    return Constants.instance;
  }
  private setImagePath(path: string){
    console.info(path)
    this.imagePath = path
  }
  public getImagePath() : string {
    return this.imagePath
  }

}
export default Constants