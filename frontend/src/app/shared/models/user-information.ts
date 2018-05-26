export class UserInformation {
  semester: string;
  courseOfStudies: string;

  constructor(semester: string, courseOfStudies: string) {
    this.semester = semester;
    this.courseOfStudies = courseOfStudies;
  }

  getSemester(): string {
    return this.semester;
  }
  setSemester(semester: string) {
    this.semester = semester;
  }
  getCourseOfStudies(): string {
    return this.courseOfStudies;
  }
  setCourseOfStudies(courseOfStudies: string) {
    this.courseOfStudies = courseOfStudies;
  }
}
