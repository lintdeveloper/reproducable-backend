import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types";
import { Resend, CreateEmailOptions } from "resend";
import { OrderPlacedEmail } from "./emails/order-placed";
import { CustomerResetPasswordEmail } from "./emails/reset-password";


type ResendOptions = {
  api_key: string;
  from: string;
  html_templates?: Record<
    string,
    {
      subject?: string;
      content: string;
    }
  >;
};

enum Templates {
  ORDER_PLACED = "order-placed",
  CUSTOMER_RESET_PASSWORD = "customer-reset-password",
}

const templates: { [key in Templates]?: (props: unknown) => React.ReactNode } =
  {
    [Templates.ORDER_PLACED]: OrderPlacedEmail,
    [Templates.CUSTOMER_RESET_PASSWORD]: CustomerResetPasswordEmail,
  };

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend";
  private resendClient: Resend;
  private options: ResendOptions;
  private logger: Logger;

  constructor(options: ResendOptions) {
    super();
    this.options = options;
    this.resendClient = new Resend(this.options.api_key);
    this.logger = this.logger;
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `api_key` is required in the provider's options."
      );
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `from` is required in the provider's options."
      );
    }
  }

  getTemplate(template: Templates) {
    if (this.options.html_templates?.[template]) {
      return this.options.html_templates[template].content;
    }
    const allowedTemplates = Object.keys(templates);

    if (!allowedTemplates.includes(template)) {
      return null;
    }

    return templates[template];
  }

  getTemplateSubject(template: Templates) {
    if (this.options.html_templates?.[template]?.subject) {
      return this.options.html_templates[template].subject;
    }
    switch (template) {
      case Templates.ORDER_PLACED:
        return "Order Confirmation";
      default:
        return "New Email";
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const template = this.getTemplate(notification.template as Templates);

    if (!template) {
      this.logger.error(
        `Couldn't find an email template for ${notification.template}. The valid options are ${Object.values(Templates)}`
      );
      return {};
    }

    const emailOptions: CreateEmailOptions = {
      from: this.options.from,
      to: [notification.to],
      subject: this.getTemplateSubject(notification.template as Templates),
      html: "",
    };

    if (typeof template === "string") {
      emailOptions.html = template;
    } else {
      emailOptions.react = template(notification.data);
      delete (emailOptions as {html?: string}).html;
    }

    const { data, error } = await this.resendClient.emails.send(emailOptions);

    if (error) {
      this.logger.error(`Failed to send email`, error);
      return {};
    }

    return { id: data?.id };
  }
}

export default ResendNotificationProviderService;
