export class FundApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class FundRequestError extends FundApiError {}

export class FundCodeError extends FundApiError {}

export class FundParseError extends FundApiError {}
