export default class GameController extends BaseComponent {
  @property({
    displayName: "rule",
    readonly: true,
  })
  rule: string = "自定义规则";
}
