export type SendMailParam = {
  from: string;
  subject: string;
  content: string;
  to: string;
};

export default abstract class IMailService {
  abstract sendMail(param: SendMailParam): Promise<void>;
}
