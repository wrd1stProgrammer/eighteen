import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from '../../../../navigation/NavigationUtils';
const TermsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 (뒤로 가기 아이콘 포함) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>서비스 이용약관</Text>
      </View>

      {/* 약관 내용 (스크롤 가능) */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.termsSection}>
          {/* 1. 계정 관련 */}
          <Text style={styles.sectionHeader}>1. 계정 관련</Text>
          <Text style={styles.termsText}>
            (주)사우스세른(South Sern (이하 “회사“))는 아이디, 비밀번호, 그리고 휴대전화 번호 인증을 필수로 하여 계정을 생성하실 수 있습니다. 다만, 실제 휴대전화의 소유주임을 확인하기 위해서 가입 당시 인증 절차를 거치게 됩니다. 또한, 다른 모바일 기기에서 서비스 사용을 연속하기 위해서는 기존에 가입하고 인증했던 휴대전화 번호로 재인증을 해야 합니다. 아래의 경우에는 계정 생성을 승인하지 않을 수 있습니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 다른 사람의 명의나 휴대전화 번호 등 개인 정보를 이용하여 계정을 생성하려 한 경우</Text>
            <Text style={styles.bulletItem}>• 동일인이 다수의 계정을 생성하려 한 경우</Text>
            <Text style={styles.bulletItem}>• 계정 생성 시 필요한 정보를 입력하지 않거나 허위 정보를 입력한 경우</Text>
            <Text style={styles.bulletItem}>• 회사가 과거에 운영원칙 또는 법률 위반 등의 정당한 사유로 해당 계정을 삭제 또는 징계한 경우</Text>
            <Text style={styles.bulletItem}>• 인터넷 사이트에서 거래 사기 이력이 있거나, 범죄에 직 간접적으로 이용되어 통신사, 금융기관, 수사기관 등에서 사실조회 이력이 있는 휴대전화 번호로 확인된 경우</Text>
          </View>
          <Text style={styles.termsText}>
            계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없습니다. 휴대폰 번호가 바뀐 경우에는 카카오 채널 문의를 통해 새 휴대폰 번호로 인증절차를 걸쳐 수정할 수 있습니다. 이용자는 자신의 계정이 제3자에 의하여 사용되고 있음을 인지한 경우, 즉시 회사에 알려야 합니다. 회사는 이용자의 개인정보보호 및 기타 서비스 부정이용행위 방지를 위하여 이용자에게 필요한 조치를 요구할 수 있으며, 이용자는 회사의 요구가 있는 즉시 해당 요청에 성실히 응해야 합니다. 회사는 이용자의 본 조에 따른 의무 불이행으로 인하여 발생한 손해에 대하여 책임지지 않습니다.
          </Text>

          {/* 2. 주의사항 및 불법행위 안내 */}
          <Text style={styles.sectionHeader}>2. 주의사항 및 불법행위 안내</Text>
          <Text style={styles.termsText}>
            회사는 이용자가 아래와 같이 잘못된 방법이나 행위로 서비스를 이용할 경우 사용에 대한 제재(이용정지, 강제 탈퇴 등)를 가할 수 있으며, 불법 서비스는 발각 즉시 자동 취소 되며 서비스비는 내부 조사 후 순차적으로 환불 접수됩니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 게시물 또는 채팅에 휴대폰 번호, SNS ID, 메신저 ID 등 개인정보를 기재하여, 어플을 통하지 않고 서비스비를 제공하려 하거나 또는 지급받고자 하는 행위</Text>
            <Text style={styles.bulletItem}>• 부정한 방법으로 서비스의 제공을 방해하거나 회사가 안내하는 방법 이외의 다른 방법을 사용하여 회사 서비스에 접근하는 행위</Text>
            <Text style={styles.bulletItem}>• 다른 이용자의 정보를 무단으로 수집, 이용하거나 다른 사람들에게 제공하는 행위</Text>
            <Text style={styles.bulletItem}>• 서비스를 영리나 홍보 목적으로 이용하는 행위</Text>
            <Text style={styles.bulletItem}>• 음란 정보나 저작권 침해 정보 등 공서양속 및 법령에 위반되는 내용의 정보 등을 발송하거나 게시하는 행위</Text>
            <Text style={styles.bulletItem}>• 주류·담배 배달을 요청하거나 수행하는 행위</Text>
            <Text style={styles.bulletItem}>• 약 배달 또는 처방전이 필요한 약품을 대리로 요청하거나 처방받는 행위</Text>
            <Text style={styles.bulletItem}>• 회사의 동의 없이 회사 서비스 또는 이에 포함된 소프트웨어의 일부를 복사, 수정, 배포, 판매, 양도, 대여, 담보제공하거나 타인에게 그 이용을 허락하는 행위</Text>
            <Text style={styles.bulletItem}>• 소프트웨어를 역설계하거나 소스 코드의 추출을 시도하는 등 회사 서비스를 복제, 분해 또는 모방하거나 기타 변형하는 행위</Text>
            <Text style={styles.bulletItem}>• 관련 법령, 회사의 모든 약관 또는 정책을 준수하지 않는 행위</Text>
            <Text style={styles.bulletItem}>• 카풀 등 여객자동차 운수사업법을 위반한 서비스를 요청하거나 수행하는 행위</Text>
            <Text style={styles.bulletItem}>• 자가용 화물차 등 유상운송을 요청하거나 수행하는 행위 (*유상운송: 영리를 목적으로 요금이나 대가를 받고 피보험 자동차를 반복적으로 사용하거나 빌려주는 행위 / 승객 또는 화물을 운송하는 경우이며, 현행법상 개인 자가용 차량을 이용한 유상운송은 불법행위로 형사처벌의 대상.)</Text>
          </View>

          {/* 3. 개인정보 보호 관련 */}
          <Text style={styles.sectionHeader}>3. 개인정보 보호 관련</Text>
          <Text style={styles.termsText}>
            개인정보는 회사 서비스의 원활한 제공을 위하여 이용자가 동의한 목적과 범위 내에서만 이용됩니다. 개인정보 보호 관련 기타 상세한 사항은 회사 개인정보처리방침을 참고하시기 바랍니다.
          </Text>

          {/* 4. 게시물의 저작권 보호 */}
          <Text style={styles.sectionHeader}>4. 게시물의 저작권 보호</Text>
          <Text style={styles.termsText}>
            - “상품 주문 게시물” 혹은 “상품 주문 내역” (이하 “게시물”) 회사 서비스 이용자가 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다. 이용자가 서비스 내에 게시하는 게시물은 검색결과 내지 서비스 및 관련 프로모션, 광고 등에 노출될 수 있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다. 이 경우, 회사는 저작권법 규정을 준수하며, 이용자는 언제든지 고객센터 또는 운영자 문의 기능을 통해 해당 게시물에 대해 삭제, 검색결과 제외, 비공개 등의 조치를 요청할 수 있습니다.
          </Text>

          {/* 5. 게시물의 관리 */}
          <Text style={styles.sectionHeader}>5. 게시물의 관리</Text>
          <Text style={styles.termsText}>
            - 이용자의 게시물이 "정보통신망법" 및 "저작권법" 등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 회사는 관련법에 따라 조치를 취하여야 합니다. 회사는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 회사 정책 및 관련법에 위반되는 경우에는 관련법에 따라 해당 게시물에 대해 임시조치(삭제, 노출제한, 게시중단) 등을 취할 수 있습니다. 만일 회사가 적절한 주의 및 조치를 했음에도 불구하고, 이용자의 게시물이 저작권 침해 등의 이유로 회사가 제3자로부터 민, 형사 법적 책임을 지는 경우, 해당 이용자는 회사를 면책시켜야 하며, 이로 인한 손해를 배상하여야 합니다. 이용자의 게시물은 완료 또는 취소가 되면 14일 뒤 모두 삭제 처리되어 복구가 불가능합니다.
          </Text>

          {/* 6. 사용권리 */}
          <Text style={styles.sectionHeader}>6. 사용권리</Text>
          <Text style={styles.termsText}>
            회사 서비스 이용을 위하여 필요한 범위 내에서 양도불가능하고 무상의 라이선스를 이용자분들에게 제공합니다. 다만, 회사 상표 및 로고를 사용할 권리를 이용자분들에게 부여하진 않습니다.
          </Text>

          {/* 7. 서비스 고지 및 홍보내용 표시 */}
          <Text style={styles.sectionHeader}>7. 서비스 고지 및 홍보내용 표시</Text>
          <Text style={styles.termsText}>
            회사 서비스 이용자분의 편의를 위해 서비스 이용과 관련된 각종 고지 및 기타 회사 서비스 홍보를 포함한 다양한 정보를 회사 서비스에 표시하거나 이용자의 휴대폰 문자로 발송할 수 있습니다.
          </Text>

          {/* 8. 위치기반서비스 관련 */}
          <Text style={styles.sectionHeader}>8. 위치기반서비스 관련</Text>
          <Text style={styles.termsText}>
            회사는 이용자의 실생활에 편리함을 최대한 제공하자 하는 유용한 서비스를 제공하기 위하여 회사 서비스에 위치기반서비스를 포함합니다. 위치기반서비스 관련 기타 상세한 사항은 회사 위치기반서비스 이용약관을 참조하시기 바랍니다.
          </Text>

          {/* 9. 서비스 중단 */}
          <Text style={styles.sectionHeader}>9. 서비스 중단</Text>
          <Text style={styles.termsText}>
            회사 서비스는 장비의 유지/보수를 위한 정기 또는 임시 점검 또는 다른 상당한 이유로 회사 서비스의 제공이 일시 중단될 수 있으며, 이때에는 미리 서비스 제공화면에 공지하겠습니다. 만약, 회사로서도 예측할 수 없는 이유로 회사 서비스가 중단된 때에는 회사가 상황을 파악하는 즉시 통지하겠습니다.
          </Text>

          {/* 10. 취소 및 환불 정책 */}
          <Text style={styles.sectionHeader}>10. 취소 및 환불 정책</Text>
          <Text style={styles.termsText}>
            - “고객”이란 회사에 개인정보를 제공하여 회원을 등록한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미하고, 서비스 요청서를 요청하는 이용자를 말합니다. “송달사”란 회사에 개인정보를 제공하여 “송달사”로 합격한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미하고, “고객”이 서비스 요청 시 수락 또는 지원하여 서비스를 수행하는 이용자를 말합니다. 송달사 개인의 사유가 아닌 불가피한 사정으로 서비스를 완료하지 못한 경우, 고객이 서비스를 취소해야 하며, 고객이 서비스 취소 시 과금 여부, 환불 및 취소 수수료는 다음과 같습니다. “서비스 금지 항목에 해당하는 서비스”란 미행, 돈 빌리기, 추천인을 금전으로 사고파는 행위, 서비스 외 광고 등 그 외 법을 위반하는 모든 서비스를 말합니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>A. 서비스 금지 항목에 해당하는 서비스의 취소: 전액 환불 불가</Text>
            <Text style={styles.bulletItem}>B. 즉시(지금 배달) 서비스의 경우</Text>
            <View style={[styles.bulletList, styles.nestedList]}>
              <Text style={styles.bulletItem}>• 캐리어 매칭 전 취소: 과금 안 됨</Text>
              <Text style={styles.bulletItem}>• 캐리어 매칭 후 5분 이내 취소: 전액 환불</Text>
              <Text style={styles.bulletItem}>• 캐리어 매칭 후 5분 초과 ~ 10분 이내 취소: 200원 과금 후 서비스비 전액 환불</Text>
              <Text style={styles.bulletItem}>• 캐리어매칭 후 10분 초과 ~ 20분 이내 취소: 3,000원 과금 후 서비스비 전액 환불</Text>
              <Text style={styles.bulletItem}>• 캐리어 매칭 후 20분 초과 취소: 5,000원 과금 후 서비스 비 전액 환불</Text>
            </View>
            <Text style={styles.bulletItem}>C. 시간 예약 서비스의 경우</Text>
            <View style={[styles.bulletList, styles.nestedList]}>
              <Text style={styles.bulletItem}>• 캐리어 매칭 전 취소: 과금 안 됨</Text>
              <Text style={styles.bulletItem}>• 캐리어 매칭 후 서비스 시간 1시간 이내 취소: 3,000원 과금 후 서비스 비 전액 환불</Text>
            </View>
          </View>
          <Text style={styles.termsText}>
            A. 서비스 수행 중 송달사가 서비스 취소 시 - 고객: 전액 환불 - 송달사: 1회 경고 후 2회 경고부터 3일 서비스 이용 제한
          </Text>

          {/* 11. 이용계약 해지(서비스 탈퇴) */}
          <Text style={styles.sectionHeader}>11. 이용계약 해지(서비스 탈퇴)</Text>
          <Text style={styles.termsText}>
            이용자가 회사 서비스의 이용을 더 이상 원치 않는 때에는 언제든지 회사 서비스 내 제공되는 메뉴를 이용하여 회사 서비스 이용계약의 해지 신청을 할 수 있으며, 회사는 법령이 정하는 바에 따라 신속히 처리하겠습니다. 다만, 거래사기 등의 부정이용 방지를 위해 거래를 진행중이거나 거래 관련 분쟁이 발생한 이용자는 이용계약 해지 및 서비스 탈퇴가 특정 기간 동안 제한될 수 있습니다. 이용계약이 해지되면 법령 및 개인정보처리방침에 따라 이용자 정보를 보유하는 경우를 제외하고는 이용자 정보나 이용자가 작성한 게시물 등 모든 데이터는 삭제됩니다. 다만, 이용자가 작성한 게시물이 제3자에 의하여 스크랩 또는 다른 공유 기능으로 게시되거나, 이용자가 제3자의 게시물에 댓글, 채팅 등 게시물을 추가하는 등의 경우에는 다른 이용자의 정상적 서비스 이용을 위하여 필요한 범위 내에서 회사 서비스 내에 삭제되지 않고 남아 있게 됩니다.
          </Text>

          {/* 12. 책임제한 */}
          <Text style={styles.sectionHeader}>12. 책임제한</Text>
          <Text style={styles.termsText}>
            회사는 회사 서비스와 관련하여 본 약관에 명시되지 않은 어떠한 구체적인 사항에 대한 약정이나 보증을 하지 않습니다. 이용자들은 법규 및 공서양속을 준수하는 범위내에서 회사의 서비스를 이용할 수 있습니다. 회사는 이용자가 법규, 공서양속 및 본 약관을 준수하지 아니하여 발생하는 분쟁 및 손해를 배상할 책임이 없습니다. 회사는 천재지변 또는 이에 준하는 불가항력, 이용자의 귀책사유로 인하여 서비스를 제공할 수 없거나, 제공이 지연된 경우에는 이와 관련된 책임에서 면책됩니다.
          </Text>

          {/* 13. 손해배상 */}
          <Text style={styles.sectionHeader}>13. 손해배상</Text>
          <Text style={styles.termsText}>
            회사의 과실로 인하여 이용자가 손해를 입게 될 경우 회사는 법령에 따라 이용자의 손해를 배상합니다. 다만, 회사는 회사 서비스에 접속 또는 이용과정에서 발생하는 이용자 또는 제3자의 개인적인 손해, 제3자가 불법적으로 회사의 서버에 접속하거나 서버를 이용함으로써 발생하는 손해, 제3자가 회사 서버에 대한 전송 또는 회사 서버로부터의 전송을 방해함으로써 발생하는 손해, 제3자가 악성 프로그램을 전송 또는 유포함으로써 발생하는 손해, 전송된 데이터의 생략, 누락, 파괴 등으로 발생한 손해, 명예훼손 등 제3자가 회사 서비스를 이용하는 과정에서 이용자에게 발생시킨 손해에 대하여 책임을 부담하지 않습니다.
          </Text>

          {/* 14. 약관의 효력 */}
          <Text style={styles.sectionHeader}>14. 약관의 효력</Text>
          <Text style={styles.termsText}>
            본 약관은 이용자의 계정 생성 및 회사 제공 서비스 이용에 관련하여 이용자와 회사 사이의 관계에 적용되며, 이용자가 약관의 내용에 동의하며 계정을 생성한 때 효력이 발생합니다. 회사는 개별 서비스에 대하여 별도의 서비스 이용약관 및 운영정책을 둘 수 있습니다. 이 경우, 개별 서비스의 제공에 관하여는 해당 이용약관 및 운영정책이 본 약관에 우선하여 적용되며, 본 약관은 개별 이용약관 및 운영정책에 반하지 아니하는 범위 내에서 적용됩니다.
          </Text>

          {/* 15. 약관의 게시 및 수정 */}
          <Text style={styles.sectionHeader}>15. 약관의 게시 및 수정</Text>
          <Text style={styles.termsText}>
            회사는 이용자가 약관을 확인할 수 있도록 앱과 카카오톡 채널에 이를 게시하며, 약관의 전문을 출력할 수 있도록 합니다. 회사는 법률이나 회사 서비스의 변경사항을 반영하기 위한 목적 등으로 본 약관이나 각 회사 서비스 고객센터의 회사 서비스 이용방법, 해당 안내 및 고지 사항을 수정할 수 있습니다. 본 약관이 변경되는 경우 변경된 약관은 게시한 날로부터 7일 후부터 효력이 발생합니다. 회사는 변경된 약관을 게시한 날로부터 효력이 발생되는 날까지 약관변경에 대한 이용자의 의견을 기다리겠습니다. 위 기간이 지나도록 이용자의 의견이 회사에 접수되지 않으면, 이용자가 변경된 약관에 따라 서비스를 이용하는 데에 동의하는 것으로 간주합니다. 이용자가 변경된 약관에 동의하지 않는 경우 변경된 약관의 적용을 받는 해당 서비스의 제공이 더 이상 불가능하게 됩니다.
          </Text>

          {/* 16. 이용자 의견 */}
          <Text style={styles.sectionHeader}>16. 이용자 의견</Text>
          <Text style={styles.termsText}>
            회사는 이용자의 의견을 소중하게 생각합니다. 이용자는 언제든지 서비스 내 회사 운영자 문의란을 통해 의견을 개진할 수 있습니다. 회사는 푸시 알림, 채팅 방법, 휴대폰 번호 등으로 이용자에게 여러 가지 소식을 알려드리며, 이용자 전체에 대한 통지는 회사 서비스 초기화면 또는 공지사항 란에 게시함으로써 효력이 발생합니다. 본 약관은 회사 이용자와의 관계에 적용되며, 제3자의 수익권을 발생시키지 않습니다. 이용자가 본 약관을 준수하지 않은 경우에, 회사가 즉시 조치를 취하지 않더라도 회사가 가지고 있는 권리를 포기하는 것이 아니며, 본 약관 중 일부 조항의 무효 또는 집행이 불가능하게 되더라도 다른 조항에는 영향을 미치지 않습니다. 본 약관 또는 회사 서비스와 관련하여서는 대한민국의 법률이 적용됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    marginRight: 10, // 타이틀과의 간격
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#333',
    flex: 1, // 타이틀이 중앙에 오도록
    textAlign: 'center', // 타이틀 중앙 정렬
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  termsSection: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
    marginBottom: 10,
    marginTop: 15,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
    lineHeight: 20, // 텍스트 간격 조정
    marginBottom: 10,
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 10,
  },
  nestedList: {
    marginLeft: 30, // 중첩 리스트의 들여쓰기
  },
  bulletItem: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
    lineHeight: 20,
    marginBottom: 5,
  },
});

export default TermsScreen;